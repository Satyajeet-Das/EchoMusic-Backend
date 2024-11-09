#This is the API which will send the recommendation list
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

class UserSongInteraction(BaseModel):#This class is intended for storing the user_id and the song_id of the song interacted with
    user_id: str
    song_id: str


class RecommendationRequest(BaseModel): #This class defines the type in which we would receive requests
    interactions: list[UserSongInteraction]
    target_user_id: str



def recommend_songs_for_user(user_id, user_song_matrix, similarity_df, top_n=5):#Function which returns a suggestion list of songs (default no of songs is 5)
    if user_id not in similarity_df.index:
        return []
    similar_users = similarity_df[user_id].sort_values(ascending=False).index[1:top_n + 1]
    user_recommendations = user_song_matrix.loc[similar_users].mean().sort_values(ascending=False).index[:top_n]
    return user_recommendations.tolist()


@app.post("/recommend")
def recommend(request: RecommendationRequest):
    interactions = request.interactions
    target_user_id = request.target_user_id


    user_song_dict = {}

    for interaction in interactions:
        user_id = interaction.user_id
        song_id = interaction.song_id

        if user_id not in user_song_dict:
            user_song_dict[user_id] = {}


        user_song_dict[user_id][song_id] = 1


    user_song_df = pd.DataFrame.from_dict(user_song_dict, orient='index').fillna(0) #if the user has not heard the song,it is marked as 0


    user_similarity = cosine_similarity(user_song_df) #Similarity matrix 
    user_similarity_df = pd.DataFrame(user_similarity, index=user_song_df.index, columns=user_song_df.index)


    recommendations = recommend_songs_for_user(target_user_id, user_song_df, user_similarity_df)

    if not recommendations:
        raise HTTPException(status_code=404, detail="User  not found or no recommendations available")

    return {"user_id": target_user_id, "recommendations": recommendations}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
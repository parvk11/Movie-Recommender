import streamlit as st
import joblib
import requests
import pandas as pd


st.title('Movie Recommender')

model = joblib.load("movie-recommender.pkl")
movies = {}

ratings_df = model["ratings_df"]
movie_df = model["movie_df"]
average_ratings = model["average_ratings"]
all_movies = model['all_movies']


movie = st.selectbox(label = 'Select Movies', options = movie_df["title"])
rating = st.selectbox(label = 'Rate Selected Movie', options =  [0.5,1,1.5,2,2.5,3,3.5,4,4.5,5][::-1])
# button  = st.button(label="Add rating")
# clear = st.button(label = "Clear Current Ratings")
# predict = st.button(label = "Show my top movies")

col1, col2, col3 = st.columns([.1, .15,.25])
with col1:
    button  = st.button(label="Add rating")
with col2:
    clear = st.button(label = "Clear Current Ratings")
with col3:
    predict = st.button(label = "Show my top movies")
    



if(clear):
    for key in st.session_state.keys():
        del st.session_state[key]
if(button):
    st.session_state[movie] = float(rating)

st.session_state

if(predict):
    url = 'http://127.0.0.1:8000/showmovies'
    response = requests.post(url = url, json = dict(st.session_state))
    
    newdf = pd.read_json(response.json(), orient="split")
    st.table(newdf)
    


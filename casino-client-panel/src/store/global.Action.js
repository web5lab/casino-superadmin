import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios/axiosInstance";

export const GetUserData = createAsyncThunk(
    "global/getUserData",
    async (token) => {
        try {
            const Response = await axiosInstance.get(`/auth/user-data`, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the request headers
                }
            });
            console.log("api data", Response);
            return Response.data;
        } catch (err) {
            if (err) {
                throw err;
            }
        }
    }
);

export const createBot = createAsyncThunk(
    "global/createBot",
    async ({data}) => {
        try {
            const Response = await axiosInstance.get(`/auth/user-data`, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the request headers
                }
            });
            console.log("api data", Response);
            return Response.data;
        } catch (err) {
            if (err) {
                throw err;
            }
        }
    }
);

export const GetBotData = createAsyncThunk(
    "global/getBotData",
    async (token) => {
        try {
            const Response = await axiosInstance.get(`/auth/bot-data`, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the request headers
                }
            });
            console.log("api data", Response);
            return Response.data;
        } catch (err) {
            if (err) {
                throw err;
            }
        }
    }
);

export const addFaq = createAsyncThunk(
    "global/addFaq",
    async ({data, token}) => {
        try {
            const Response = await axiosInstance.post(`/auth/add-faq`, data, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the request headers
                }
            });
            console.log("api data", Response);
            return Response.data;
        } catch (err) {
            if (err) {
                throw err;
            }
        }
    }
);

export const addPdfData = createAsyncThunk(
    "global/addPdfData",
    async ({data, token}) => {
        try {
            const Response = await axiosInstance.post(`/auth/add-pdf`, data, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the request headers
                }
            });
            console.log("api data", Response);
            return Response.data;
        } catch (err) {
            if (err) {
                throw err;
            }
        }
    }
);

export const addWebSiteData = createAsyncThunk(
    "global/addWebSiteData",
    async ({data, token}) => {
        try {
            const Response = await axiosInstance.post(`/auth/add-website`, data, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the request headers
                }
            });
            console.log("api data", Response);
            return Response.data;
        } catch (err) {
            if (err) {
                throw err;
            }
        }
    }
);

export const getBotsession = createAsyncThunk(
    "global/getBotsession",
    async ({data, token}) => {
        try {
            const Response = await axiosInstance.post(`/auth/get-bot-session`, data, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the request headers
                }
            });
            console.log("api data", Response);
            return Response.data;
        } catch (err) {
            if (err) {
                throw err;
            }
        }
    }
);

export const getBotSessionData = createAsyncThunk(
    "global/getBotSessionData",
    async ({data, token}) => {
        try {
            const Response = await axiosInstance.post(`/auth/get-bot-session-data`, data, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the request headers
                }
            });
            console.log("api data", Response);
            return Response.data;
        } catch (err) {
            if (err) {
                throw err;
            }
        }
    }
);

export const chatApi = createAsyncThunk(
    "global/chatApi",
    async ({data, token}) => {
        try {
            const Response = await axiosInstance.post(`/auth/chat-api`, data, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the request headers
                }
            });
            console.log("api data", Response);
            return Response.data;
        } catch (err) {
            if (err) {
                throw err;
            }
        }
    }
);
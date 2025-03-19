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

export const getTransactions = createAsyncThunk(
    "global/getTransactions",
    async (token) => {
        try {
            const Response = await axiosInstance.post(`/api/user/user-transactions`, {
                "casinoId": "67d08e00bc3e0f5336e30a5c"
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

import express from 'express'

interface ResponseData {
	userId?: string
}

export type Response = express.Response<any,ResponseData>

/* eslint-disable @typescript-eslint/no-empty-interface */
import express from 'express'

interface BaseResponseLocals {}

interface ResponseLocalDataWhenAuth extends BaseResponseLocals {
	userId?: string
}

interface ResponseLocalDataWhenNotAuth extends BaseResponseLocals {}

type ResponseLocalData<auth = false> = auth extends true
	? ResponseLocalDataWhenAuth
	: ResponseLocalDataWhenNotAuth

export type Response<auth = false, ResBody = unknown> = express.Response<
	ResBody,
	ResponseLocalData<auth>
>

/*
 * @Author: your name
 * @Date: 2020-11-02 09:36:58
 * @LastEditTime: 2020-12-09 10:26:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clin-ui\src\api\login.js
 */
/*
 *    Copyright (c) 2018-2025, lengleng All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lengleng (wangiegie@gmail.com)
 */
import settings from '@/settings'
import axios from 'axios';
const scope = 'server'

export const loginByUsername = (username, password, code, randomStr) => {
  const grant_type = 'password'
  return axios({
    url: '/clinbrain/api/auth/oauth/token',
    headers: {
      'isToken':false,
      'sysClass': settings.sysCode,
      'Authorization': 'Basic cGlnOnBpZw=='

    },
    method: 'post',
    params: { username, password, randomStr, code, grant_type, scope }
  })
}

export const refreshToken = (refresh_token) => {
  const grant_type = 'refresh_token'
  return axios({
    url: '/clinbrain/api/auth/oauth/token',
    headers: {
      'isToken': false,
      'sysClass': settings.sysCode,
      'Authorization': 'Basic cGlnOnBpZw==',
    },
    method: 'post',
    params: { refresh_token, grant_type, scope }
  })
}

export const getSSo = () => {
  return axios({
    url: '/clinbrain/api/sso',
    method: 'get',
  })
}

export const loginByUsernameBase = (token) => {
  return axios({
    url: '/clinbrain/api/auth/oauth/token',
    headers: {
      'Authorization': 'Basic cGlnOnBpZw==',
      'sysClass': settings.sysCode,
      'token': token
    },
    method: 'post',
  })
}

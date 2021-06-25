import React from 'react';
import {NavigationContainer} from '@react-navigation/native'

import {AuthRoutes} from './auth.routes'
import { Background } from '../components/Background';
import { useAuth } from '../hooks/auth';
import {SignIn} from '../screens/SignIn'

export function Routes(){
    const { user } = useAuth()
    return(
        <NavigationContainer>
            {user.id ? 
            <Background>
              <AuthRoutes />   
            </Background> : <SignIn/>}
        </NavigationContainer>
    )
}
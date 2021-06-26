import React,{useState, useCallback} from 'react';
import { View, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {styles} from './styles'

import { CategorySelect } from '../../components/categorySelect'
import { ButtonAdd } from '../../components/ButtonAdd';
import { Profile } from '../../components/Profile';
import {Background} from '../../components/Background'
import {Load} from '../../components/Load/Load'

import { ListHeader } from '../../components/ListHeader';
import { Appointment, AppointmentProps } from '../../components/Appointment';
import ListDivider from '../../components/ListDivider';
import { COLLECTION_APPOINTMENTS } from '../../config/database';
import AsyncStorage from '@react-native-async-storage/async-storage';


export function Home(){
    const [category,setCategory] = useState('')
    const [loading,setLoading] = useState(true)
    const [appointment,setAppointment] = useState<AppointmentProps[]>([])
    const navigation = useNavigation()


    function handleCategorySelect(categoryId: string){
        categoryId === category ? setCategory('') : setCategory(categoryId)
    }

    function handleAppointmentDetails(guildSelect: AppointmentProps){
        navigation.navigate('AppointmentDetails',{guildSelect})
    }

    function handleAppointmentCreate(){
        navigation.navigate('AppointmentCreate')
    }

    async function loadAppointments(){
        const response = await AsyncStorage.getItem(COLLECTION_APPOINTMENTS)
        const storage: AppointmentProps[] = response ? JSON.parse(response) : []

        if(category){
            setAppointment(storage.filter( item => item.category === category))
        }else{
            setAppointment(storage)
        }

        setLoading(false)
    }

    useFocusEffect(useCallback( () => {
        loadAppointments()
    },[category]))

    return(
        <Background>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Profile/>
                    <ButtonAdd onPress={handleAppointmentCreate}/>
                </View>

                
            <CategorySelect
                categorySelected={category}
                setCategory={handleCategorySelect}
            />
            {loading ? <Load/> : 
            <>
                <ListHeader title='Partidas agendadas' subtitle={`Total ${appointment.length}`}/>

                <FlatList
                    data={appointment}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => (
                        <Appointment 
                            data={item}
                            onPress={() =>handleAppointmentDetails(item)}
                        />
                    )}
                    ItemSeparatorComponent={() => <ListDivider/>}
                    contentContainerStyle={{paddingBottom: 69}}
                    style={styles.matches}
                    showsVerticalScrollIndicator={false}
                />
            </>}
        </View>    
        </Background>
    )
}
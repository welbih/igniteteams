import { useState, useEffect, useRef } from 'react';

import { useNavigation, useRoute } from '@react-navigation/native';

import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { ButtonIcon } from '@components/ButtonIcon';
import { Input } from '@components/Input';
import { Filter } from '@components/Filter';
import { Alert, FlatList, TextInput } from 'react-native';
import { PlayerCard } from '@components/PlayerCard';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';
import { AppError } from '@utils/AppError';
import { playerAddByGroup } from 'src/storage/player/playerAddByGroup';
import { playersGetByGroup } from 'src/storage/player/playersGetByGroup';
import { playersGetByGroupAndTeam } from 'src/storage/player/playersGetByGroupAndTeam';
import { PlayerStorageDTO } from 'src/storage/player/PlayerStorageDTO';

import  { Container, Form, HeaderList, NumbersOfPlayers } from './styles';
import { playerRemoveByGroup } from 'src/storage/player/playerRemoveByGroup';
import { groupRemoveByName } from 'src/storage/group/groupRemoveByName';
import { Loading } from '@components/Loading';

type RouteParams = {
    group: string;
}

export function Players() {
    const [isLoading, setIsLoading] = useState(true);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [team, setTeam] = useState('Time A');
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

    const route = useRoute();
    const { group } = route.params as RouteParams;

    const newPlayerNameInputRef = useRef<TextInput>(null);

    const navigation = useNavigation();

    async function handleAddPlayer() {
        if(newPlayerName.trim().length === 0) {
            return Alert.alert('Nova Pessoa', 'Informe o nome da pessoa para adicionar.');
        }

        const newPlayer = {
            name: newPlayerName,
            team
        }

        try {
            await playerAddByGroup(newPlayer, group);
            await playersGetByGroup(group);

            newPlayerNameInputRef.current?.blur();

            setNewPlayerName('');
            fetchPlayersByTeam();
        } catch (error) {
            if(error instanceof AppError) {
                Alert.alert('Nova pessoa', error.message)
            } else {
                console.log(error);
                Alert.alert('Nova pessoa', 'Não foi possível adicionar');
            }
        }
    }

    async function fetchPlayersByTeam() {
        try{
            setIsLoading(true);
            const playersByTeam = await playersGetByGroupAndTeam(group, team);
            setPlayers(playersByTeam);
            setIsLoading(false);
        } catch(error) {
            console.log(error);
            Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionado');
        }
    }

    async function handlePlayerRemove(playerName: string) {
        try{
            await playerRemoveByGroup(playerName, group);
            fetchPlayersByTeam();

        } catch(error) {
            console.log(error);
            Alert.alert('Remover pessoa', 'Não foi possível remover essa pessoa.');
        }
    }

    async function groupRemove() {
        try {
           await groupRemoveByName(group);
           navigation.navigate('groups');
        } catch (error) {   
            console.log(error);
            Alert.alert('Remover grupo', 'Não foi possível remover a turma.');
        }
    }

    async function handleGruopRemove() {
        Alert.alert('Remover', 'Deseja remover a turma?',
            [
                { text: 'Não', style: 'cancel'},
                { text: 'Sim', onPress: () => groupRemove() }
            ]
        )
    }

    useEffect(() => {
        fetchPlayersByTeam();
    }, [team]);

    return (
        <Container>
            <Header showBackButton/>

            <Highlight 
                title={group}
                subtitle='adicione a galera e separe os times'
            />

            <Form>
                <Input
                    inputRef={newPlayerNameInputRef}
                    onChangeText={setNewPlayerName}
                    value={newPlayerName}
                    placeholder='Nome da pessoa'
                    autoCorrect={false}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType='done'
                />
                <ButtonIcon                     
                    icon='add'
                    onPress={handleAddPlayer}
                />
            </Form>

            
            <HeaderList>            
                <FlatList 
                    data={['Time A', 'Time B']}
                    keyExtractor={item => item}
                    renderItem={({item}) => (
                        <Filter 
                            title={item}
                            isActive={item === team}
                            onPress={() => setTeam(item)}
                        />
                    )}
                    horizontal
                />
            
                <NumbersOfPlayers>
                    {players.length}
                </NumbersOfPlayers>
            </HeaderList>

            {
                isLoading ? <Loading/> 
                :             
                <FlatList 
                    data={players}
                    keyExtractor={item => item.name}
                    renderItem={({item}) => (
                        <PlayerCard 
                            name={item.name}
                            onRemove={() => handlePlayerRemove(item.name)}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <ListEmpty 
                            message='Não há pessoas neste time.'
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        {paddingBottom: 100},
                        players.length === 0 && {flex: 1}
                    ]}
                />
            }

            <Button 
                title='Remover turma'
                type='SECONDARY'
                onPress={() => handleGruopRemove()}
            />
        </Container>
    );
}
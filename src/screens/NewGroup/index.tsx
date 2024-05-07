import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Highlight } from '@components/Highlight';
import { Container, Content, Icon } from './styles';

import { Header } from '@components/Header';
import { Button } from '@components/Button';
import { Input } from '@components/Input';

import { groupCreate } from 'src/storage/group/groupCreate';

export function NewGroup() {
    const [group, setGroup] = useState('');

    const navigation = useNavigation();

    async function handleNew() {
        try {
            await groupCreate(group);
            navigation.navigate('players', {group: group});
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <Container>
            <Header showBackButton/>

            <Content>
                <Icon />

                <Highlight 
                    title='Nova turma'
                    subtitle='crie a turma para adicionar as pessoas'
                />

                <Input 
                    placeholder='Nome da turma'
                    onChangeText={setGroup}
                />

                <Button
                    title='Criar'
                    style={ {marginTop: 20}}
                    onPress={handleNew}
                />
            </Content>

        </Container>
    );
}
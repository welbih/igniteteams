import { TouchableOpacityProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Container, Icon } from './styles';

type Props = TouchableOpacityProps & {

}

export function ButtonIcon({} : Props) {
    return (
        <Container>
            <Icon name="home" type='SECONDARY'/>
        </Container>
    );
}
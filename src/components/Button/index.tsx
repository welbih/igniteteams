import { TouchableOpacityProps } from 'react-native';

import { Container, ButtontypeStyleProps, Title } from './styles';

type Props = TouchableOpacityProps & {
    title: string;
    type?: ButtontypeStyleProps;
}

export function Button({title, type = 'PRIMARY', ...rest} : Props) {
    return (
        <Container 
            type={type} 
            {...rest} 
        >
            <Title>
                {title}
            </Title>
        </Container>
    );
}
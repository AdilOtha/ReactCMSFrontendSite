import React, { useState } from 'react';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Button,
  Heading,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import axios from '../../interceptors/auth.interceptor';
import { apiUrl } from '../../helpers/apiUrl';
import auth from '../../services/Auth';

export default function Login(props) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const toast = useToast();

  const loginSubmit = (event) => {
    event.preventDefault();

    const body = { email, password };

    axios.post(`${apiUrl}/api/auth/login`, body)
      .then((res) => {
        if (res.response && (res.response.status !== 200)) {
          toast({
            title: "Login Failed!",
            description: res.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else if (res.data) {
          localStorage.setItem("token", res.data.token);
          auth.login(() => {
            props.history.push("/");
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Box>
      <form onSubmit={loginSubmit}>
        <Flex
          minH={'100vh'}
          align={'center'}
          justify={'center'}
          bg={useColorModeValue('teal.50', 'gray.800')}>
          <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Stack align={'center'}>
              <Heading fontSize={'4xl'}>Sign in to your account</Heading>
            </Stack>
            <Box
              rounded={'lg'}
              bg={useColorModeValue('white', 'gray.700')}
              boxShadow={'lg'}
              p={8}>
              <Stack spacing={4}>
                <FormControl id="email">
                  <FormLabel>Email address</FormLabel>
                  <Input type="email" onChange={(event) => { setEmail(event.target.value) }} />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Input type="password" onChange={(event) => { setPassword(event.target.value) }} />
                </FormControl>
                <Box>
                  <Button
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                      bg: 'blue.500',
                    }} isFullWidth type="submit">
                    Sign in
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Flex>
      </form>
    </Box>
  );
}
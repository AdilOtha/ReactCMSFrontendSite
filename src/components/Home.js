import React, { useEffect, useState } from 'react';
import {
    Box,
    Heading,
    Link,
    Image,
    Text,
    HStack,
    Tag,
    useColorModeValue,
    Container,
    Button,
    Textarea,
    useToast,
    color,
} from '@chakra-ui/react';
import { Icon, Link as ChakraLink } from "@chakra-ui/react"
import { Link as RouterLink } from 'react-router-dom';
import { MdThumbUp, MdComment } from "react-icons/md";
import { apiUrl } from '../helpers/apiUrl';
import auth from "../services/Auth";
import { useHistory } from 'react-router';

import axios from '../interceptors/auth.interceptor';

// interface IBlogTags {
//     tags: Array<string>;
//     marginTop?: SpaceProps['marginTop'];
// }

const BlogTags = (props) => {
    return (
        <HStack spacing={2} marginTop={props.marginTop}>
            {props.tags.map((tag) => {
                return (
                    <Tag size={'md'} variant="solid" colorScheme="orange" key={tag}>
                        {tag}
                    </Tag>
                );
            })}
        </HStack>
    );
};

// interface BlogAuthorProps {
//     date: Date;
//     name: string;
// }

export const BlogAuthor = (props) => {
    return (
        <HStack marginTop="2" spacing="2" display="flex" alignItems="center">
            <Image
                borderRadius="full"
                boxSize="40px"
                src="https://100k-faces.glitch.me/random-image"
                alt={`Avatar of ${props.name}`}
            />
            <Text fontWeight="medium">{props.name}</Text>
            <Text>—</Text>
            <Text>{props.date.toLocaleDateString("en-IN")}</Text>
        </HStack>
    );
};

const Article = (props) => {

    const toast = useToast();

    const { articleData, updateArticleData, history } = props;

    const [comment, setComment] = useState('');

    const getCategoryNames = () => {
        return articleData.categoryIds.map((category) => {
            return category.name;
        })
    }

    const likeArticle = async (articleId) => {
        if (!auth.isAuthenticated()) {
            return history.push('/login');
        } else {
            const body = {
                articleId,
            };

            try {
                const result = await axios.post(apiUrl + "/api/site/articles/like", body);
                console.log(result);
                updateArticleData('like', result.data)
            } catch (err) {
                console.log(err);
            }
        }
    }

    const toggleCommentBox = () => {
        if (!auth.isAuthenticated()) {
            return history.push('/login');
        } else {
            articleData.isCommentOpen = !articleData.isCommentOpen;
            updateArticleData('toggleComment', articleData);
        }
    }

    const submitComment = async () => {
        if (!auth.isAuthenticated()) {
            return history.push('/login');
        } else {
            const body = {
                content: comment,
                articleId: articleData._id
            }

            try {
                const result = await axios.post(apiUrl + "/api/site/comments/insert", body);
                if (result.response && result.response.status !== 200) {
                    toast({
                        title: "Error",
                        status: "error",
                        description: JSON.stringify(result.response.data),
                        duration: 5000,
                        isClosable: true,
                    });
                } else {
                    toast({
                        title: "Comment Posted!",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    })
                    setComment('');
                    articleData.isCommentOpen = false;
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    return (
        <Box
            marginTop={{ base: '1', sm: '5' }}
            marginBottom={6}
            display="flex"
            flexDirection={{ base: 'column', sm: 'row' }}
            justifyContent="space-between">
            <Box
                display="flex"
                flex="1"
                marginRight="3"
                position="relative"
                alignItems="center">
                <Box
                    width={{ base: '100%', sm: '85%' }}
                    zIndex="2"
                    marginLeft={{ base: '0', sm: '5%' }}
                    marginTop="5%">
                    <Link as={RouterLink} to={`/articles/${articleData._id}`} textDecoration="none" _hover={{ textDecoration: 'none' }}>
                        <Image
                            borderRadius="lg"
                            src={
                                'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80'
                            }
                            alt="some good alt text"
                            objectFit="contain"
                        />
                    </Link>
                </Box>
                <Box zIndex="1" width="100%" position="absolute" height="100%">
                    <Box
                        bgGradient={useColorModeValue(
                            'radial(orange.600 1px, transparent 1px)',
                            'radial(orange.300 1px, transparent 1px)'
                        )}
                        backgroundSize="20px 20px"
                        opacity="0.4"
                        height="100%"
                    />
                </Box>
            </Box>
            <Box
                display="flex"
                flex="1"
                flexDirection="column"
                justifyContent="center"
                marginTop={{ base: '3', sm: '0' }}>
                <BlogTags tags={articleData.categoryIds.length > 0 ? getCategoryNames() : ["General"]} />
                <Heading marginTop="1">
                    <Link as={RouterLink} to={`/articles/${articleData._id}`} textDecoration="none" _hover={{ textDecoration: 'none' }}>
                        {articleData.title}
                    </Link>
                </Heading>
                {/* <Text
                        as="p"
                        marginTop="2"
                        color={useColorModeValue('gray.700', 'gray.200')}
                        fontSize="lg">
                        Lorem Ipsum is simply dummy text of the printing and typesetting
                        industry. Lorem Ipsum has been the industry's standard dummy text
                        ever since the 1500s, when an unknown printer took a galley of type
                        and scrambled it to make a type specimen book.
                    </Text> */}
                <HStack marginTop="2" spacing="2" display="flex" alignItems="center">
                    <Text>Date Posted:</Text>
                    <Text>{articleData.datePosted && new Date(articleData.datePosted).toLocaleDateString("en-IN")}</Text>
                </HStack>
                <HStack display="flex" alignItems="center" spacing={4} marginTop={6}>
                    <HStack>
                        <Icon as={MdThumbUp} color={articleData.likes.length === 0 ? "gray.400" : "teal.400"}
                            _hover={articleData.likes.length === 0 ? { color: "gray.500" } : { color: "teal.400" }}
                            onClick={() => { likeArticle(articleData._id) }} cursor="pointer" boxSize={'1.5em'}></Icon>
                        <Text>{articleData.noOfLikes}</Text>
                    </HStack>
                    <HStack>
                        <Icon onClick={toggleCommentBox} as={MdComment} color="gray.400" _hover={{ color: "gray.500" }} cursor="pointer" boxSize={'1.5em'}></Icon>
                        <Text>0</Text>
                    </HStack>
                </HStack>
                {auth.isAuthenticated() && articleData.isCommentOpen && (
                    <Box mt={4}>
                        <Textarea name="comment" value={comment} placeholder="enter a comment..."
                            onChange={(event) => { setComment(event.target.value); }} />
                        <HStack mt={2}>
                            <Button onClick={submitComment} size="sm" variant="solid" bg="teal.400" color="white">Submit</Button>
                            <Button as={RouterLink} to={`/articles/${articleData._id}`} variant="link" color="teal.400">View all comments</Button>
                        </HStack>
                    </Box>
                )}
                {!auth.isAuthenticated() && (
                    <Text marginTop={4}>Please <ChakraLink as={RouterLink} color="teal.500" textDecoration="underline" to={'/login'}>Login</ChakraLink> to Like and Comment</Text>
                )}
            </Box>
        </Box >
    );
}

export default function Home() {
    const history = useHistory();

    const [articles, setArticles] = useState([]);

    useEffect(() => {
        axios.get(apiUrl + "/api/site/articles")
            .then(res => {
                res.data.articles.forEach((article) => {
                    article.isCommentOpen = false;
                });
                console.log(res);
                setArticles(res.data.articles);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const updateArticleData = (updateType, updatedValue) => {
        if (updateType === 'like' || updateType === 'toggleComment') {
            const index = articles.findIndex(element => element._id === updatedValue._id);
            console.log(index);
            if (index !== -1) {
                articles[index] = updatedValue;
            }
            setArticles([...articles]);
        }
    };

    return (
        <Container maxW={'7xl'} p="6">
            <Heading as="h1">Stories</Heading>
            {articles.map((data) => {
                return <Article key={data._id} articleData={data} updateArticleData={updateArticleData}
                    history={history} />
            })}
        </Container>
    );
};
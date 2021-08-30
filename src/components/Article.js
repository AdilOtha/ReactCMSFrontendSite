import React, { useEffect, useState } from 'react';
import { convertToHTML } from 'draft-convert';
import { stateToHTML } from 'draft-js-export-html';
import { useParams } from 'react-router-dom';
import { convertFromRaw, EditorState } from 'draft-js';
import DOMPurify from 'dompurify';
import { Heading, Text, useColorModeValue, Container, VStack, Box, Spinner, Center } from '@chakra-ui/react';

import axios from '../interceptors/auth.interceptor';

require('dotenv').config();

export default function Article() {
    const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_API_URL : process.env.REACT_APP_DEV_API_URL;
    let { articleId } = useParams();
    // console.log(articleId);

    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [convertedContent, setConvertedContent] = useState(null);
    const [title, setTitle] = useState('');
    const [comments, setComments] = useState([]);
    const [isLoading, setIsloading] = useState(true);

    const createMarkup = (html) => {
        // console.log(convertedContent);
        return {
            __html: DOMPurify.sanitize(html)
        }
    }

    useEffect(() => {
        setIsloading(true);
        if (articleId) {
            axios.get(apiUrl + "/api/site/articles/" + articleId)
                .then((res) => {
                    // console.log(res);
                    if (res.data.body !== null) {
                        if (!res.data.body.hasOwnProperty('entityMap')) {
                            res.data.body = { ...res.data.body, entityMap: {} };
                        }
                        setTitle(res.data.title);
                        const _contentState = convertFromRaw(res.data.body);
                        // console.log(_contentState);
                        setEditorState(EditorState.createWithContent(_contentState));
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            axios.get(apiUrl + "/api/site/comments/" + articleId)
                .then((res) => {
                    console.log(res);
                    if (res.data) {
                        setComments(res.data);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            setTimeout(() => {
                setIsloading(false);
            }, 500);
        } else {
            setIsloading(false);
            console.log("ArticleId Not Found");
        }
    }, [apiUrl, articleId]);

    useEffect(() => {
        if (!editorState.getCurrentContent().hasText()) {
            setConvertedContent(null);
        } else {
            let currentContentAsHTML = stateToHTML(editorState.getCurrentContent());
            setConvertedContent(currentContentAsHTML);
        }
    }, [editorState]);

    return (
        <>
            <Container maxW={'7xl'} minHeight={'83vh'} p="12">
                {isLoading ? (<Center alignItems="center"> <Spinner thickness={2} size="xl" color="teal.400" /> </Center>) :
                    (<>
                        <VStack spacing="2" alignItems="flex-start">
                            {convertedContent ? (<>
                                <Heading as="h2" mb={4}>{title}</Heading>
                                <Text as="div" fontSize="lg" dangerouslySetInnerHTML={createMarkup(convertedContent)}>
                                </Text>
                            </>) : (<Text as="div" fontSize="lg">
                                Empty Article
                            </Text>)}
                        </VStack>
                        <VStack alignItems="flex-start" marginTop={6}>
                            <Heading size="md" my={2}>Comments:</Heading>
                            {comments.map((comment) => {
                                return <Box key={comment._id} d="flex" alignItems="stretch" flexDirection="column" w={["100%","60%","35%"]} rounded="md" p={2} bg="blue.50" border="1px" borderColor="blue.200" ringColor="blackAlpha.400">
                                    <Heading size="sm">{comment.userId.fname + ' ' + comment.userId.lname}</Heading>
                                    <Text my={2}>{comment.content}</Text>
                                    <Text alignSelf="flex-end">{new Date(comment.datePosted).toLocaleDateString("IN")}</Text>
                                </Box>
                            })}
                        </VStack>
                    </>)}
            </Container>
        </>
    )
}
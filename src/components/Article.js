import React, { useEffect, useState } from 'react';
import { convertToHTML } from 'draft-convert';
import { stateToHTML } from 'draft-js-export-html';
import { useParams, Link as RouterLink, useHistory } from 'react-router-dom';
import { convertFromRaw, EditorState } from 'draft-js';
import DOMPurify from 'dompurify';
import {
  Heading,
  Text,
  Container,
  VStack,
  Box,
  Spinner,
  Center,
  HStack,
  Button,
  Textarea,
  useToast,
  IconButton,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { MdThumbUp, MdComment } from 'react-icons/md';
import auth from '../services/Auth';
import axios from '../interceptors/auth.interceptor';
import { apiUrl } from '../helpers/apiUrl';

export default function Article() {
  let { articleId } = useParams();
  const history = useHistory();
  const toast = useToast();
  // console.log(articleId);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [convertedContent, setConvertedContent] = useState(null);
  const [article, setArticle] = useState(null);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {
    setIsloading(true);
    if (articleId) {
      axios
        .get(apiUrl + '/api/site/articles/' + articleId)
        .then(res => {
          // console.log(res);
          if (res.data) {
            setArticle(res.data);
          }
          if (res.data?.body) {
            if (!res.data.body.entityMap) {
              res.data.body = { ...res.data.body, entityMap: {} };
            }
            const _contentState = convertFromRaw(res.data.body);
            // console.log(_contentState);
            setEditorState(EditorState.createWithContent(_contentState));
          }
        })
        .catch(err => {
          console.log(err);
        });            
    } else {
      setIsloading(false);
      console.log('ArticleId Not Found');
      throw new Error('Article Not Found');
    }
  }, [articleId]);

  useEffect(() => {
    if (!editorState.getCurrentContent().hasText()) {
      setConvertedContent(null);
    } else {
      let currentContentAsHTML = stateToHTML(editorState.getCurrentContent());
      setConvertedContent(currentContentAsHTML);
    }
    axios
        .get(apiUrl + '/api/site/comments/' + articleId)
        .then(res => {
          console.log(res);
          if (res.data) {
            setCommentList(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(()=>{
            setIsloading(false);
        })
  }, [editorState, articleId]);

  const createMarkup = html => {
    // console.log(convertedContent);
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  const likeArticle = async articleId => {
    if (!auth.isAuthenticated()) {
      return history.push('/login');
    } else {
      const body = {
        articleId,
      };

      try {
        const result = await axios.post(
          apiUrl + '/api/site/articles/like',
          body
        );
        console.log(result);
        if (result.data) {
          setArticle(prevVal => {
            return {
              ...prevVal,
              noOfLikes: result.data.noOfLikes,
              likes: result.data.likes,
            };
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const toggleCommentBox = () => {
    if (!auth.isAuthenticated()) {
      return history.push('/login');
    } else {
      setIsCommentOpen(prevVal => {
        return !prevVal;
      });
    }
  };

  const loadComments = () => {
    axios
      .get(apiUrl + '/api/site/comments/' + articleId)
      .then(res => {
        console.log(res);
        if (res.data) {
          setCommentList(res.data);
          setArticle((oldArticleData)=>{
              return {...oldArticleData, noOfComments: res.data.length}
          })
        }
      })
      .catch(err => {
        console.log(err);
      });    
  };

  const submitComment = async () => {
    if (!auth.isAuthenticated()) {
      return history.push('/login');
    } else {
      const body = {
        content: comment,
        articleId: article._id,
      };

      try {
        const result = await axios.post(
          apiUrl + '/api/site/comments/insert',
          body
        );
        if (result.response && result.response.status !== 200) {
          toast({
            title: 'Error',
            status: 'error',
            description: JSON.stringify(result.response.data),
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: 'Comment Posted!',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          setComment('');
          loadComments();
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <Container maxW={'7xl'} minHeight={'83vh'} p="12">
        {isLoading ? (
          <Center>            
            <Spinner thickness={4} size="xl" color="teal.400" />
          </Center>
        ) : (
          <>
            <VStack spacing="2" alignItems="flex-start">
              {convertedContent ? (
                <>
                  <Heading as="h2" mb={4}>
                    {article.title}
                  </Heading>
                  <Text
                    as="div"
                    fontSize="lg"
                    dangerouslySetInnerHTML={createMarkup(convertedContent)}
                  ></Text>
                </>
              ) : (
                <Text as="div" fontSize="lg">
                  Empty Article
                </Text>
              )}
            </VStack>
            {article && (
              <HStack
                display="flex"
                alignItems="center"
                spacing={4}
                marginTop={6}
              >
                <HStack>
                  <IconButton
                    title="Like"
                    icon={<MdThumbUp />}
                    color={
                      article.likes?.length === 0 ? 'gray.400' : 'teal.400'
                    }
                    _hover={
                      article.likes?.length === 0
                        ? { color: 'gray.500' }
                        : { color: 'teal.400' }
                    }
                    onClick={() => {
                      likeArticle(article._id);
                    }}
                  ></IconButton>
                  <Text>{article.noOfLikes}</Text>
                </HStack>
                <HStack>
                  <IconButton
                    title="Comment"
                    onClick={toggleCommentBox}
                    icon={<MdComment />}
                    colorScheme={'gray'}
                    _hover={{ color: 'gray.500' }}
                    cursor="pointer"
                  ></IconButton>
                  <Text>{article.noOfComments}</Text>
                </HStack>
              </HStack>
            )}
            {auth.isAuthenticated() && isCommentOpen && (
              <Box mt={4}>
                <Textarea
                  name="comment"
                  value={comment}
                  placeholder="enter a comment..."
                  onChange={event => {
                    setComment(event.target.value);
                  }}
                />
                <HStack mt={2}>
                  <Button
                    onClick={submitComment}
                    size="sm"
                    variant="solid"
                    bg="teal.400"
                    color="white"
                  >
                    Submit
                  </Button>
                </HStack>
              </Box>
            )}
            {!auth.isAuthenticated() && (
              <Text marginTop={4}>
                Please{' '}
                <ChakraLink
                  as={RouterLink}
                  color="teal.500"
                  textDecoration="underline"
                  to={'/login'}
                >
                  Login
                </ChakraLink>{' '}
                to Like and Comment
              </Text>
            )}
            <Heading size="md" my={2} marginTop={6} marginBottom={4}>
              Comments:
            </Heading>
            <VStack alignItems="flex-start" maxH="45vh" overflowY="auto">
              {commentList.length > 0 ? (
                commentList.map(comment => {
                  return (
                    <Box
                      key={comment._id}
                      d="flex"
                      alignItems="stretch"
                      flexDirection="column"
                      w={['100%', '60%', '35%']}
                      rounded="md"
                      p={2}
                      bg="blue.50"
                      border="1px"
                      borderColor="blue.200"
                      ringColor="blackAlpha.400"
                    >
                      <Heading size="sm">
                        {comment.userId.fname + ' ' + comment.userId.lname}
                      </Heading>
                      <Text my={2}>{comment.content}</Text>
                      <Text alignSelf="flex-end">
                        {new Date(comment.datePosted).toLocaleDateString('IN')}
                      </Text>
                    </Box>
                  );
                })
              ) : (
                <Text>No comments yet...</Text>
              )}
            </VStack>
          </>
        )}
      </Container>
    </>
  );
}

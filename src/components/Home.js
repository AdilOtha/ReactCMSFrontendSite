import React, { useEffect, useState } from 'react';
import {
    Box,
    Heading,
    Link,
    Image,
    Text,
    Divider,
    HStack,
    Tag,
    Wrap,
    WrapItem,
    SpaceProps,
    useColorModeValue,
    Container,
    VStack,
} from '@chakra-ui/react';

import axios from 'axios';

require('dotenv').config();

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

    const { articleData } = props;

    const getCategoryNames = () => {
        return articleData.categoryIds.map((category)=>{
            return category.name;
        })
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
                    <Link textDecoration="none" _hover={{ textDecoration: 'none' }}>
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
                <BlogTags tags={articleData.categoryIds.length>0 ? getCategoryNames() : ["General"] } />
                <Heading marginTop="1">
                    <Link textDecoration="none" _hover={{ textDecoration: 'none' }}>
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
            </Box>
        </Box>
    );
}

export default function Home() {
    const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_API_URL : process.env.REACT_APP_DEV_API_URL;

    const [articles, setArticles] = useState([]);

    useEffect(() => {
        axios.get(apiUrl + "/api/articles")
            .then(res => {
                console.log(res);
                setArticles(res.data.articles);
            })
            .catch(err => {
                console.log(err);
            });
    }, [apiUrl]);

    return (
        <Container maxW={'7xl'} p="6">
            <Heading as="h1">Stories</Heading>
            {articles.map((data, index) => {
                return <Article key={index} articleData={data} />
            })}
        </Container>
    );
};
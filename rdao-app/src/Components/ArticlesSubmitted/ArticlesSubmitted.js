import "./articlesSubmitted.css";
import ArticleItem from "../ArticleItem/ArticleItem";
import VoteItem from "../VoteItem/VoteItem";
import { Col, Container, Row } from "reactstrap";
import { v4 as uuidv4 } from 'uuid';


function ArticlesSubmitted(props) {

    return (
        props.Articles.map((article) => {
            var title = article['title'];
            var link = article['link'];
            var author = article['author'];
            var index = article['index'];
            var numberVotes = article['numberVotes'];
            var userNbVotes = article['userNbVotes'];
            var voteCost = article['voteCost'];

            if (article!=null) {
                    return(
                        <Container key={uuidv4()}>
                            <Row>
                                <Col className="Article-info" xs={8} md={8}>
                                    <ArticleItem title={title} link={link} author={author} numberVotes={numberVotes} />
                                </Col>
                                <Col className="Vote-info" xs={3} md={3}>
                                    <VoteItem index={index} userNbVotes={userNbVotes} voteCost={voteCost} provider={props.provider} RDAO={props.RDAO} governanceContract={props.governanceContract} />
                                </Col>
                            </Row>
                        </Container>
                    );
            } else {
                return (
                    <>
                    </>
                )};
        })
    )
}

export default ArticlesSubmitted
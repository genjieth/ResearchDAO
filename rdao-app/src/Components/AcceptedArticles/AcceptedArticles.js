import './acceptedArticles.css';
import AcceptedItem from "../AcceptedItem/AcceptedItem";
import { v4 as uuidv4 } from 'uuid';

function AcceptedArticles(props) {
  return (
      props.Articles.map((article) => {
        var title = article['title'];
        var link = article['link'];
        var author = article['author'];
        var numberVotes = article['numberVotes'];

        if (article!=null) {
          return(
            <div key={uuidv4()} className="acceptedItem">
              <AcceptedItem title={title} link={link} author={author} numberVotes={numberVotes} />
            </div>
          );
        } else {
          return (
              <>
              </>
          )};
      })
  )
}

export default AcceptedArticles
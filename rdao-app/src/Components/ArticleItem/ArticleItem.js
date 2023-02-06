import "./articleItem.css";

function ArticleItem(props) {
  return (
    <div className='article'>
        <div className="title">
            <a href={props.link} target="_blank" rel="noreferrer">{props.title.slice(0,-4)}</a>
        </div>
        <div className="author">
          <a href={'https://hyperspace.filfox.info/en/address/'+props.author} target="_blank" rel="noreferrer">{props.author.slice(0,5) + '...' + props.author.slice(-4)}</a>
        </div>
        <div className="vote text-center">
          Current score: {props.numberVotes}
        </div>
    </div>
  )
}

export default ArticleItem
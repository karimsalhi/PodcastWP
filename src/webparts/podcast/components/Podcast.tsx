import * as React from 'react';
import { IPodcastProps } from './IPodcastProps';
import { PodcastGrid }  from './PodcastGrid';


export default class Podcast extends React.Component<IPodcastProps, {}> {
  constructor(props:IPodcastProps) {
    super(props);
  }
  public render(): React.ReactElement<IPodcastProps> {

    return (
      <div className="App">
      <h1>Podcast Player</h1>
        <PodcastGrid
          rssfeed={this.props.rssFeed}
          count={this.props.count}
          height= "500px"
          width="100%"
         />
    </div>
    );
  }
}

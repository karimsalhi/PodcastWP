import * as React from 'react';
import { useState } from 'react';
import { IPodcastProps } from './IPodcastProps';
import { PodcastGrid }  from './PodcastGrid';

export const Podcast:React.FC<IPodcastProps> = (props: IPodcastProps) => {

  const [quickFilter, setQuickFilter] = useState("");
    
    const handleFilterChange = (event: any)=>{
        setQuickFilter(event.target.value);
    }

    return (
      <div className="App">
        <div>
            <label htmlFor="quickfilter">Quick Filter:</label>
            <input type="text" id="quickfilter" name="quickfilter"
                value={quickFilter} onChange={handleFilterChange}/>        
        </div>
          <h1>Podcast Player</h1>
        <PodcastGrid
          rssfeed={props.rssFeed}
          count={props.count}
          height= "500px"
          width="100%"
          quickFilter={props.quickFilter}
         />
    </div>
    )
}
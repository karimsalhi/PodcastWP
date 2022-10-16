import {useEffect, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import { IPodcastGridProps } from './PodcastGridProps';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import * as React from 'react';

export const PodcastGrid:React.FC<IPodcastGridProps> = (props: IPodcastGridProps) => {
    const [rowData, setRowData] = useState([]);
    
    useEffect(() => {
      // eslint-disable-next-line no-void
      void fetch(props.rssfeed)
                .then(response => response.text())
                .then(str => new window.DOMParser().parseFromString(str, 'text/xml'))
                .then(data => {            
                    const itemList = data.querySelectorAll('item');
            
                    const items: React.SetStateAction<{ title: string; description:string; pubDate: Date; mp3: string; }[]>=[];

                    for (let i = 0; i < props.count; i++) {
                      items.push({
                        pubDate: new Date(itemList[i].querySelector('pubDate').textContent),
                        description: itemList[i].querySelector('description').textContent.replace(/(<([^>]+)>)/gi, ''),
                        title: itemList[i].querySelector('title').innerHTML,
                        mp3: itemList[i].querySelector('enclosure').getAttribute('url')
                      })
                    }

                    setRowData(items);
                });
    }, [props.rssfeed])

    const columnDefs = [
      {
        headerName: 'Episode Title',
        field: 'title',
        wrapText: true,
        autoHeight: true,
        flex: 2,
        resizable: true,
        filter: `agGridTextFilter`
      },
      {
        headerName: 'Description',
        field: 'description',
        wrapText: true,
        autoHeight: true,
        flex: 2,
        resizable: true,
        filter: `agGridTextFilter`,
        valueFormatter: (params: { data: { description: string; }; }) => params.data.description.length > 125 ?
                         params.data.description.substr(0,125) + "..." :
                         params.data.description
      },
      {
        headerName: 'Published',
        field: 'pubDate',
        sortable: true,
        filter: 'agDateColumnFilter'
      },
      {
        headerName: 'Episode',
        field: 'mp3',
        flex: 2,
        autoHeight: true,
        cellRenderer: ((params: { value: unknown; }) =>`
          <audio controls preload="none"
              style="height:2em; vertical-align: middle;">
              <source src=${params.value} type="audio/mpeg" />
          </audio>`)
      }
    ];

    return (
       <div className="ag-theme-alpine"
              style={{height: props.height, width: props.width}}>   
           <AgGridReact
                rowData={rowData}
                columnDefs ={columnDefs}
                 />
       </div>
    )
}
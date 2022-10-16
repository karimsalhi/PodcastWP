import {useEffect, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import { IPodcastGridProps } from './IPodcastGridProps';

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
                        title: itemList[i].querySelector('title').innerHTML,
                        mp3: itemList[i].querySelector('enclosure').getAttribute('url'),
                        description: itemList[i].querySelector('description').textContent.replace(/(<([^>]+)>)/gi, '')
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
        hide: true
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
          </audio>`),
      }
    ];

    const [gridApi, setGridApi] = useState<any>();

    const onGridReady = (params: any) => {
      setGridApi(params.api);
    }

    useEffect(()=>{
      if(gridApi){
        console.log("From grid")
        console.log(props.quickFilter)
        gridApi.setQuickFilter(props.quickFilter);
      }
    }, [gridApi, props.quickFilter])

    return (
       <div className="ag-theme-alpine"
              style={{height: props.height, width: props.width}}>   
           <AgGridReact
                onGridReady={onGridReady}
                rowData={rowData}
                columnDefs ={columnDefs}
                 />
       </div>
    )
}
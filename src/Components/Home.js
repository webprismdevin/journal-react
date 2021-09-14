import React, {Component} from 'react';
import RichEditor from './RichEditor';
import dayjs from 'dayjs';

class Home extends Component {
    constructor(props){
        super(props);

        this.state = {
            editorContent: null,
            journalEntries: [],
            selectedEntry: null,
            reset: 0
        };

        this.user = this.props.user;
    }

    componentDidMount(){
        this.fetchData();
    }

    fetchData = () => {
        this.setState({journalEntries: []}, () => {
            this.user.get('journal').map().on((data, id) => {
                if(data) { 
                    let alreadyAdded = this.state.journalEntries.filter(e => e._id === id);
                    alreadyAdded.length === 0 && this.setState({journalEntries: [...this.state.journalEntries, {_id: id, dateTime: data.dateTime, entry: JSON.parse(data.entry)}]})
                }
                return;
            });
        }); 
    }

    componentWillUnmount(){
        this.user.get('journal').off();
    }

    editorContentLift = (data) => {
        this.setState({editorContent: data});
    }

    saveToJournal = () => {
        this.user.get('journal').set({
            dateTime: dayjs().toISOString(),
            entry: JSON.stringify(this.state.editorContent)
        });
    }

    loadEditor = (i) => {
        this.setState({selectedEntry: i})
    }

    deleteEntry = (i) => {
        this.user.get('journal').get(i).put(null, () => {
            this.fetchData();
        });
    }

    resetEditor = () => {
        this.setState({
            selectedEntry: null,
            reset: this.state.reset + 1
        })
    }

    render(){
        return(
            <section>
                <div className="container is-fluid">
                    <RichEditor reset={this.state.reset} editorContentLift={this.editorContentLift} selectedEntry={this.state.selectedEntry} user={this.user}/>
                    <br/>
                    <div className="is-flex is-justify-content-space-between">
                        <input type="button" className="button" value="Save to Journal" onClick={this.saveToJournal} disabled={this.state.selectedEntry !== null}/>
                        <input type="button" className="button" value="Clear" onClick={this.resetEditor}/>
                    </div>
                </div>
                <br />
                <hr />
                <div className="container is-fluid">
                    <ul>
                        {this.state.journalEntries.map((e, index) => 
                            <li key={e._id} className="box">
                                <div className="is-flex is-justify-content-space-between">
                                    <div className="content">{e.entry.blocks[0].text}</div>
                                    <button onClick={() => this.deleteEntry(e._id)} className="delete"></button>
                                </div>
                                <div className="is-flex is-justify-content-space-between">
                                    <button onClick={() => this.loadEditor(e._id)} className="button">Open</button> 
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
            </section>
        )
    }
}

export default Home;
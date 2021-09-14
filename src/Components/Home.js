import React, {Component} from 'react';
import RichEditor from './RichEditor';
import dayjs from 'dayjs';
import { produce } from 'immer';
import { toast } from 'react-toastify';

class Home extends Component {
    constructor(props){
        super(props);

        this.state = {
            editorContent: null,
            journalEntries: {},
            selectedEntry: null,
            reset: 0
        };

        this.user = this.props.user;

    }

    componentDidMount(){

        this.user.get('journal').map().on((data, id) => {

            this.setState(prevState => produce(prevState, draft => { 
                if (data) draft.journalEntries[id] = {_id: id, dateTime: data.dateTime, entry: JSON.parse(data.entry)}; 
                if (!data) delete draft.journalEntries[id]
            }))

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
        }, () => {
            toast.success('Journal entry saved!', {
                pauseOnHover: false
            })
        });
    }

    loadEditor = (i) => {
        this.setState({selectedEntry: i})
    }

    deleteEntry = (i) => {
        toast.error("Click to confirm and delete the entry. To cancel, hit the x", {
            onClick: () => this.user.get('journal').get(i).put(null),
            autoClose: 6000,
            position: 'bottom-right'
        })
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
                        {Object.entries(this.state.journalEntries).map(([id, entry]) => 
                            <li key={entry._id} className="box">
                                <div className="is-flex is-justify-content-space-between">
                                    <div className="content">{dayjs(entry.dateTime).format("MMM DD, YYYY | hh:mm a")}</div>
                                    <button onClick={() => this.deleteEntry(entry._id)} className="delete"></button>
                                </div>
                                <div className="content">{entry.entry.blocks[0].text}</div>
                                <div className="is-flex is-justify-content-space-between">
                                    <button onClick={() => this.loadEditor(entry._id)} className="button">Read</button> 
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
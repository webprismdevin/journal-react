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

    saveOrUpdate = () => {
        if(this.state.selectedEntry) {
            this.updateEntry(this.state.selectedEntry);
        } else {
            this.saveToJournal();
        }

        this.setState({
            selectedEntry: null,
            reset: this.state.reset + 1
        })
    }
    
    updateEntry = (id) => {
        this.user.get('journal').get(id).put({
            entry: JSON.stringify(this.state.editorContent),
        }, () => {
            toast.success('Journal entry updated!', {
                pauseOnHover: false
            })
        });
    }

    saveToJournal = () => {
        this.user.get('journal').set({
            dateTime: dayjs().toISOString(),
            entry: JSON.stringify(this.state.editorContent),
        }, () => {
            toast.success('Journal entry saved!', {
                pauseOnHover: false
            })
        });
    }

    loadEditor = (i, r) => {
        this.setState({
            selectedEntry: i,
            readOnly: r
        })
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
            <>
            <section className="section">
                <div className="container">
                    <RichEditor reset={this.state.reset} editorContentLift={this.editorContentLift} selectedEntry={this.state.selectedEntry} readOnly={this.state.readOnly} user={this.user}/>
                    <br/>
                    <div className="is-flex is-justify-content-space-between">
                        <input type="button" className="button is-primary is-light" 
                            value={this.state.selectedEntry ? "Update" : "Save"}
                            onClick={this.saveOrUpdate} 
                            disabled={this.state.readOnly === true}
                        />
                        <input type="button" className="button is-info is-light" value="New" 
                            onClick={this.resetEditor}
                        />
                    </div>
                </div>
            </section>
            <section className="section">
                <div className="container">
                    <ul>
                        {
                        Object.entries(this.state.journalEntries)
                        .sort(([a,b], [c,d]) => {
                            if(dayjs(b.dateTime).isBefore(d.dateTime)) return 1;
                            else return -1;
                        })
                        .map(([id, entry]) => 
                            <li key={entry._id} className="box">
                                <div className="is-flex is-justify-content-space-between">
                                    <div className="content">{dayjs(entry.dateTime).format("MMM DD, YYYY | hh:mm a")}</div>
                                    <button onClick={() => this.deleteEntry(entry._id)} className="delete"></button>
                                </div>
                                <div className="content">{entry.entry.blocks[0].text}</div>
                                <div className="is-flex is-justify-content-space-between">
                                    <button onClick={() => this.loadEditor(entry._id, true)} className="button">Read</button>
                                    <button onClick={() => this.loadEditor(entry._id, false)} className="button">Edit</button>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
            </section>
            </>
        )
    }
}

export default Home;
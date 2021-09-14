import React, {Component} from 'react';
import RichEditor from './RichEditor';

class Home extends Component {
    constructor(props){
        super(props);

        this.state = {
            editorContent: null,
            journalEntries: [],
            selectedEntry: null
        };

        this.user = this.props.user;
    }

    componentDidMount(){
        this.user.get('journal').map().once((entry, id) => {
            if(entry) this.setState({journalEntries: [...this.state.journalEntries, {_id: id, entry: JSON.parse(entry)}]})

            return;
        });

    }

    componentWillUnmount(){
        this.props.user.get('journal').off();
    }

    editorContentLift = (data) => {
        this.setState({editorContent: data});
    }

    saveToJournal = () => {
        this.user.get('journal').set(JSON.stringify(this.state.editorContent));
    }

    loadEditor = (i) => {
        this.setState({selectedEntry: i})
    }

    deleteEntry = (i) => {
        this.user.get('journal').get(i).put(null, (res) => console.log(res));
    }

    render(){
        return(
            <div>
                <RichEditor editorContentLift={this.editorContentLift} selectedEntry={this.state.selectedEntry} user={this.user}/>
                <input type="button" value="Save to Journal" onClick={this.saveToJournal}/>
                <ul>
                    {this.state.journalEntries.map((e, index) => <li key={e._id}><button onClick={() => this.loadEditor(e._id)}>Open {e._id}</button> <button onClick={() => this.deleteEntry(e._id)}>Delete</button></li>)}
                </ul>
            </div>
        )
    }
}

export default Home;
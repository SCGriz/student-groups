var React = require("-aek/react");
var Container = require("-components/container");
var {VBox,Panel} = require("-components/layout");
var {BannerHeader} = require("-components/header");
var {BasicSegment} = require("-components/segment");
var {Listview,Item} = require("-components/listview");

var Input = require("@ombiel/aek-lib/react/components/input");
var Button = require("@ombiel/aek-lib/react/components/button");

var xml2js = require("xml2js");

var request  = require('-aek/request');

var Screen = React.createClass({

  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
   this.getData();
 },

  getData: function(){
    //request.get("http://localhost/asum/")
    request.get("http://staging.umt.edu/asum/student_groups/default.xml")
    .end((e, res)=>{
      this.setState({
        data: res
      });
    });
  },

renderRow: function() {

},
getInitialState: function(){
  return { searchString: '' };
},
handleChange: function(e){
  this.setState({searchString:e.target.value});
},
  render:function() {

    var parseString = xml2js.parseString;

    var groups = null;

if(this.state.data) {
    parseString(this.state.data.text, function (err, result) {
        groups = result.student_groups.group;
    });
  }
    var loading = !groups;

    var searchString = this.state.searchString.toLowerCase().trim();

    if(searchString.length > 0){
      groups = groups.filter(function(group){
        return(group.name[0].toLowerCase().match(searchString));
      });
    }

    return (
      <Container>
        <VBox>
          <BannerHeader theme="alt" icon="book" key="header" flex={0}>
            Student Groups
          </BannerHeader>
          <Panel>
          <div style={{marginBottom:"1em"}}>
            <Input icon="search" name="name" fluid size="large?">
            <input type="text"
              placeholder="Search..."
              value={this.state.searchString}
              onChange={this.handleChange} />
            <Button variation="alt" href="#/feed/">Search</Button>
            </Input>
          </div>
          <BasicSegment loading={loading}>
            <Listview items={groups} itemFactory={(group)=>{
              return(
                    <Item>
                      <h2><a href="campusm://openURL?type=external&url=subject.url/">{group.name}</a></h2>

                      <h3>About:</h3>
                      <p>{group.category}</p>
                      <p>{group.recognized}</p>
                      <p>{group.purpose}</p>

                      <h3>Online:</h3>
                          <a href={group.url}>University Page</a>
                          <a href={group.facebook_url}>{group.facebook}</a>
                          <a href={"http://twitter.com/"+ group.twitter}>{group.twitter}</a>
                      <h3>ASUM:</h3>
                          <p>{group.advisor}</p>
                          <p>{group.contact}</p>

                    </Item>
                  );
                }}/>
          </BasicSegment>

          </Panel>
        </VBox>
      </Container>
    );
  }
});

var row = React.createClass({
  render: function() {
  }
});
React.render(<Screen/>,document.body);

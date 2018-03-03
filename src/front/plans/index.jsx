import React from 'react';
import Axios from 'axios';
import config from '../../config.json';
import * as utils from '../../lib/utils';
import { Grid, Row, Col, Panel, ListGroup, ListGroupItem, Jumbotron, PageHeader, Label }  from 'react-bootstrap'


const Plan = ({plan}) =>  {
  return (
    <Col xs={12} md={6}>
      <Panel bsStyle="primary">
        <Panel.Heading><strong>Plano {plan.name}</strong></Panel.Heading>
        <Panel.Body>
          Valor do plano: <strong>{utils.getCurrency(plan.total)}</strong>          
        </Panel.Body>
          {
            // plan.diff >= 0 ? false : (
            //   <Label bsStyle="success">Economia de {utils.getCurrency(plan.total)}</Label>              
            // )
          } 
        <ListGroup>
          {
            !plan.items.length ? false
            : (
              <div>
                <ListGroupItem bsStyle="info"><strong>Itens do plano</strong></ListGroupItem>
                {
                  plan.items.map((item, i) => 
                    <ListGroupItem key={i}>{item.name}</ListGroupItem>
                  )   
                }
              </div>
            )        
          }
        </ListGroup>
      </Panel>
    </Col>
    )
  }

  class Plans extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        plans: []
      };
    }

    componentWillMount(){
      const that = this
      Axios.get("http://localhost:"+config.port+"/api/list-all-broadband")
      .then((response) => {
        that.setState({
          plans: response.data.plans
        })
      })
      .catch((error) => {
        console.log(error);
      });

    }

    render () {
      const that = this
      let row = [];
    	return (
      <Grid>
        <PageHeader>
          <small>Desafio Melhor Plano</small>
          <p>
            Planos de Banda Larga
          </p>          
        </PageHeader>
        <h6>{that.state.plans.length} Planos</h6>    
        <Jumbotron>  

          
            { 
              !that.state.plans.length ? false :
                that.state.plans.map((plan, i) => {                  
                  row.push(<Plan key={i} plan={plan} />)
                  
                  if((i%2) == 0){
                    if(i == (that.state.plans.length - 1)){
                      let rowPrint = row; 
                      row = [];

                      return (
                        <Row className="show-grid" key={i}>
                          {
                            rowPrint
                          }
                        </Row>
                      ); 
                    } else {                      
                      return false;
                    }
                  } else {
                    let rowPrint = row; 
                    row = [];

                    return (
                      <Row className="show-grid" key={i}>
                        {
                          rowPrint
                        }
                      </Row>
                    ); 
                  }
                }
                  
                )
            }

        </Jumbotron>
      </Grid>
      )

    }

  }


  export default Plans;

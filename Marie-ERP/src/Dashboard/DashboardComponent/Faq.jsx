import React from 'react'
import { Accordion, Row, Col } from 'react-bootstrap';

function Faq() {
    const faqData = [
        {
          Ingredients: [
            {
              question: "How can an F&B benefit from Ingredients?",
              answer: [
                "Tailored just for F&B operators.",
                "Ingredients is a robust inventory system for operators to make clever purchase decisions when restocking.",
                "The system is quick to add new ingredients, simplifies stockcounts and eliminate wasteful data entries.",
              ],
            },
            {
              question: "Can I download past records for physical safekeeping?",
              answer: [
                "Yes. Select the download icon under Stockcards. Then, filter for the dates that you require.",
                "You'll receive a PDF copy summarizing ingredient stockcards within the chosen dates.",
              ],
            },
            {
              question:
                "Is the app mobile friendly to save on time during stocktaking?",
              answer: [
                "Yes. We know it is super important for F&Bs to be quick and accurate during their regular stocktake.",
                "Ingredients is made mobile friendly to enable quick data inputs during stocktakes and purchase routines.",
              ],
            },
            {
              question:
                "How is an ingredient consumption determined on the stockcards?",
              answer: [
                "'Stockcount + Bought - Closing Stock' equates to Consumption.",
              ],
            },
          ],
          Labour: [
            {
              question: "How can an F&B benefit from Labour?",
              answer: [
                "Labour allows F&B operators to administer employee benefits online such as annual leave, overtime etc.",
                "Use our autopilot to make your HR managers smile more often.",
                "Learn how much workforce adds to the costs of your menu selection across different sales channels.",
              ],
            },
            {
              question:
                "How can I update labour related costs such as pension contributions?",
              answer: [],
            },
            {
              question:
                "I would like to start rewarding my foreign workers with annual leave benefits, how can I update Labour?",
              answer: [],
            },
            {
              question: "What is meant as Traceable?",
              answer: [
                "Traceable is where you can view the portion of labour related costs (eg. medicals benefits, permits, pension contributions etc.) that gets traced to an individual employee.",
                "This amount is added onto an employee's base salary. Then gets distributed to supply chain activities connected to the employee.",
              ],
            },
          ],
          Overheads: [
            {
              question: "How can an F&B benefit from Overheads?",
              answer: [
                "Overheads show the relationship between ongoing expenses and your supply chain activities.",
                "Learn type of costs that are driven by menu complexity and decision to have multiple sales channels.",
              ],
            },
            {
              question:
                "How are Overheads and ProcessBuilder connected to one another?",
              answer: [
                "ProcessBuilder creates the supply chain framework for an F&B. Here, costs (eg. rental, electricity etc.) are selected to match activities in the supply chain such as procurement, ordering etc.",
                "Under Overheads, users define the relationship between indirect costs and selected supply chain activities.",
              ],
            },
            {
              question:
                "I am new to the F&B industry, can I provide estimation for Overheads?",
              answer: [
                "Yes, you can. Try to keep them reasonable by comparing against your friends running an F&B.",
                "Remember to select estimation when entering costs data for Overheads.",
              ],
            },
            {
              question: "What is required to complete Overheads?",
              answer: [
                "You can enter data from your F&Bs latest audited or management figures.",
                "Otherwise, you can always provide an estimation for the relevant cost items.",
                "Marie ERP works based on month duration data.",
                "When you choose to enter annual data, the system will just extrapolate accordingly.",
              ],
            },
          ],
          ProcessBuilder: [
            {
              question: "What is the ProcessBuilder?",
              answer: [
                "ProcessBuilder is the overview of an F&Bs supply chain activities.",
                "The concept builds a relationship between each activity and paid resources such as petrol, cleaning materials, building rental etc. required to run operations.",
              ],
            },
            {
              question: "How can I edit the ProcessBuilder?",
              answer: [
                "You can choose to edit paid resources which are linked to each supply chain activity.",
                "However, paid resources with a dark blue background cannot be removed as these are common costs.",
                "For example, Ingredients and Labour remain an unremovable costs from the Procurement supply chain activity.",
              ],
            },
            {
              question: "Why is the ProcessBuilder important?",
              answer: [
                "ProcessBuilder is the foundation on how indirect costs (i.e. indirect labour and overheads) are traced to menu products for an F&B.",
                "It is best practice to complete the ProcessBuilder right after onboarding with Marie ERP.",
                "Once ProcessBuilder is completed, remember to enter costs data under other modules.",
              ],
            },
          ],
          Sales: [
            {
              question: "How can I add a new sales channel?",
              answer: [
                "Under the sales menu, you can add a new sales channel.",
                "Adding a new sales channel, affects the structure of other modules such as the ProcessBuilder and Overheads.",
                "Hence, our Helpdesk will be in touch to complete the process of adding a new sales channel for your F&B on Marie ERP.",
              ],
            },
            {
              question: "Why keeping Sales data up-to-date is important?",
              answer: [
                "We use sales volume data to determine accurate costing for your menu products.",
                "So when accurate data is presented, the more accurate your product costs will be for each of your sales channel.",
              ],
            },
            {
              question: "What are my options if got no time to update Sales data?",
              answer: [
                "Yes, we understand running an F&B is hectic and challenging.",
                "Upgrade to our Pro plan whereby our support team will maintain your data quality at all times.",
                "Just send us your source documents such as point-of-sales reports or sales listing from your delivery partner and we will take care of the rest.",
              ],
            },
            {
              question:
                "Should I have any privacy concerns about entering Sales data into Marie ERP?",
              answer: [
                "Marie ERP strictly adheres to the data privacy laws of countries where we have a presence.",
                "We respect your trust in Marie ERP and will do our best to have in place controls to avoid any leakage of your sensitive data.",
              ],
            },
          ],
          Costing: [
            {
              question: "How can an F&B benefit from Costing?",
              answer: [
                "The Costing module is the crown jewel of Marie ERP.",
                "It's what makes Marie ERP unique from other ERP platforms.",
                "F&Bs can now learn the business costs which includes recipe costs, labour and overheads that goes in producing a menu product.",
                "This becomes the foundation to make the right business decision to drive greater earnings.",
              ],
            },
            {
              question:
                "How are the prices for Ingredients calculated for a product recipe?",
              answer: [
                "The Costing module imports data from Ingredients.",
                "The average cost of an ingredient over the past month will be used to determine recipe cost for the chosen product.",
              ],
            },
            {
              question: "What is meant as Direct Labour and Indirect Labour?",
              answer: [
                "Direct Labour is employee time that has an observable impact on serving a menu product.",
                "Thie refers to the Preparation and Production activity of either a food or beverage.",
                "Indirect Labour is the cost of an employee that is not directly linked to Preparation and Production.",
              ],
            },
            {
              question:
                "What are the differences between sides, premixes and mains in Costing?",
              answer: [
                "Sides",
                "The complementary food portion served alongside with the menu product. Think of sides such as soups, curries, yoghurt, sauces, salads etc served on a separate plate or bowl.",
                "Premixes", "The base preparation of a gravy or dish that is prepared beforehand to reduce production time upon a customer order. Typically done in batches.", "Mains", "The ingredients and labour time that go into production upon a customer order."
              ],
            },
          ],
        },
      ];
    
  return (
    <div>
        <h3 className="mx-3 mt-2 mb-3 text-center">
          Frequently Asked Questions (FAQs)
        </h3>

        {faqData &&
          faqData.map((obj) =>
            Object.keys(obj).map((k, i) => {
              return (
                <Row className="pt-4 pb-5" key={i}>
                  <Col lg={3} className="p-2 px-3 px-lg-5 pb-3">
                    <h5>{k}</h5>
                  </Col>
                  <Col lg={8}>
                    <Accordion defaultActiveKey="1">
                      {obj[k] &&
                        obj[k].map((e, i) => {
                          return (
                            <Accordion.Item key={i} eventKey={i}>
                              <Accordion.Header>{e.question}</Accordion.Header>
                              <Accordion.Body>
                                <ol style={{listStyle : 'none'}}>
                                  {e.answer &&
                                    e.answer.map((answer, i) => {
                                      return <li key={i}>{answer}</li>;
                                    })}
                                </ol>
                              </Accordion.Body>
                            </Accordion.Item>
                          );
                        })}
                    </Accordion>
                  </Col>
                </Row>
              );
            })
          )}
    </div>
  )
}

export default Faq
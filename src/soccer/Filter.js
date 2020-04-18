import React from 'react'
import 'firebase/auth'
import 'firebase/firestore'
import { getRoundRobinStage } from '../core/Utilities'
import { Row, Col } from 'reactstrap'

class Filter extends React.Component {
  getFilterNames = (array) => {
    let result = []
    array.map((item) => result.push({ name: item.name, filter: item.name.replace(' ', '-') }))
    return result
  }

  render() {
    const { param } = this.props
    const { doc } = param
    const { stages } = doc.schedule
    const filterStages = this.getFilterNames(stages)
    const rrStages = getRoundRobinStage(stages)
    // console.log('stages', stages)
    return (
      <Row className="mt-5">
        <Col lg="12">
          <ul id="match-flters">
            <li data-filter="*" className="filter-active col-3">
              All matches
            </li>
            {filterStages.map((stage) => (
              <li data-filter={`.filter-${stage.filter}`} className="col-3 offset-1" key={stage.name}>
                {stage.name}
              </li>
            ))}
            {rrStages.map((stage) => {
              const filterGroups = this.getFilterNames(stage.groups)
              return filterGroups.map((group, index) => {
                const offset = index % 4 === 0 ? '' : ' offset-1'
                return (
                  <li data-filter={`.filter-${group.filter}`} className={`col-2${offset}`} key={group.name}>
                    {group.name}
                  </li>
                )
              })
            })}
          </ul>
        </Col>
      </Row>
    )
  }
}

export default Filter

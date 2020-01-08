import React from 'react'
import moment from 'moment'

const SiteSummary = ({site}) => {
  return (
    <div className="card z-depth-0 site-summary">
      <div className="card-content grey-text text-darken-3">
        <span className="card-title ">{site.title}</span>
        <p>Posted by {site.authorFirstName} {site.authorLastName}</p>
        <p className="grey-text">{moment(site.createdAt.toDate()).calendar()}</p>
      </div>
    </div>
  )
}

export default SiteSummary

import React from 'react'
import SiteSummary from './SiteSummary'
import { Link } from 'react-router-dom'

const SiteList = ({sites}) => {
  return (
    <div className="site-list section">
      { sites && sites.map(site => {
        return (
          <Link to={'/site/' + site.id} key={site.id}>
            <SiteSummary site={site} />
          </Link>
        )
      })}  
    </div>
  )
};

export default SiteList

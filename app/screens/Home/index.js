import React, {useEffect, useState} from 'react';
import {Link} from 'react-router';
import axios from 'axios';
import moment from 'moment';
import constants from 'helpers/constants';
import shuffle from 'helpers/shuffle';
import About from 'components/About';
import Button from 'components/Button';
import Card from 'components/Card';
import Legend from 'components/Legend';
import Person from 'components/Person';
import SpeakerData from '../../../api/speakers';

const DATE_FORMAT = 'MMMM D, YYYY';
const {Dates} = constants;

export default () => {
  const [ticketList, setTicketList] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:2000/api/releases').then(res => {
      console.log(res.data.data || res.data.releases);
      setTicketList(res.data.data || res.data.releases);
    });
  }, []);

  return (
    <div className="Home">
      <div className="Home__About">
        <h2>What is React Rally?</h2>
        <About />
        <Link to="/about" className="Button medium">
          More about React Rally &raquo;
        </Link>
      </div>
      {Object.keys(SpeakerData).length > 0 ? (
        <div className="align-center">
          <Legend>Featured Speakers</Legend>
          {shuffle(Object.keys(SpeakerData))
            .filter(key => SpeakerData[key].featured)
            .map(key => {
              return <Person {...SpeakerData[key]} key={key} />;
            })}
        </div>
      ) : null}

      {/*
      <div>
        <Legend>Upcoming Dates</Legend>
        <ul>
          <li>
            CFP Opens <b>{moment.utc(Dates.CFP_OPEN).format(DATE_FORMAT)}</b>
          </li>
          <li>
            CFP Closes <b>{moment.utc(Dates.CFP_CLOSE).format(DATE_FORMAT)}</b>
          </li>
          <li>
            Early Bird - Round One{' '}
            <b>{moment.utc(Dates.TICKET_RELEASE).format(DATE_FORMAT)}</b>
          </li>
          <li>
            Early Bird - Round Two{' '}
            <b>
              {moment
                .utc(Dates.TICKET_RELEASE)
                .add(7, 'days')
                .format(DATE_FORMAT)}
            </b>
          </li>
          <li>
            Standard Tickets{' '}
            <b>
              {moment
                .utc(Dates.TICKET_RELEASE)
                .add(14, 'days')
                .format(DATE_FORMAT)}
            </b>
          </li>
        </ul>
      </div>
      */}

      <div className="align-center">
        <Legend>Tickets</Legend>
        {ticketList
          .filter(t => !t.secret)
          .map(t => {
            const price = (isNaN(t.price) ? '' : '$') + parseInt(t.price, 10);
            const isOnSale = moment.utc().isAfter(moment.utc(t.start_at));
            const label = t.sold_out
              ? 'Sold Out'
              : isOnSale
              ? 'Buy Now'
              : 'Coming Soon';

            return (
              <Card key={t.id} className="TicketCard">
                <h3>{t.title}</h3>
                <p>{t.description}</p>
                <h2>{price}</h2>
                <Button
                  href={constants.Links.TICKET_SALES}
                  disabled={t.sold_out}>
                  {label}
                </Button>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

/* eslint-disable no-undef, no-unused-vars */

import * as React from 'react';

import { Donut } from '../../../graphs';
import { Descriptor } from '../types';

export const PodStatusChart: React.SFC<PodStatusChartProps> = (props) => {
  const {statusDescriptor, fetcher} = props;
  const donutFetcher = () => {
    const fetched = fetcher();
    const values = fetched;
    const labels = ["Available","Used"];
    return Promise.resolve([values, labels]);
  };

  return <Donut fetch={donutFetcher} kind={statusDescriptor.path} title={statusDescriptor.displayName} />;
};

export type PodStatusChartProps = {
  statusDescriptor: Descriptor;
  fetcher: () => any;
};

PodStatusChart.displayName = 'PodStatusChart';

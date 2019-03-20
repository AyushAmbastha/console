import * as React from 'react';
import * as _ from 'lodash-es';

import { ColHead, DetailsPage, List, ListHeader, ListPage } from './factory';
import { Kebab, LabelList, navFactory, ResourceKebab, SectionHeading, ResourceLink, ResourceSummary, Timestamp, Selector, StatusIcon} from './utils';

import { FLAGS, connectToFlags } from '../features';
import { PodStatusChart } from './operator-lifecycle-manager/descriptors/status/pods';

const pvcPhase = pvc => pvc.status.phase;

const PVCStatus = ({pvc}) => {
  const phase = pvcPhase(pvc);
  return <StatusIcon status={phase} />;
};

const { common } = Kebab.factory;
const menuActions = [...common];

const Header = props => <ListHeader>
  <ColHead {...props} className="col-sm-4 col-xs-6" sortField="metadata.name">Name</ColHead>
  <ColHead {...props} className="col-sm-4 col-xs-6" sortField="metadata.labels">Labels</ColHead>
  <ColHead {...props} className="col-sm-4 hidden-xs" sortField="metadata.creationTimestamp">Created</ColHead>
</ListHeader>;

const kind = 'PersistentVolume';
const Row = ({obj}) => <div className="row co-resource-list__item">
  <div className="col-sm-4 col-xs-6">
    <ResourceLink kind={kind} name={obj.metadata.name} namespace={obj.metadata.namespace} title={obj.metadata.name} />
  </div>
  <div className="col-sm-4 col-xs-6">
    <LabelList kind={kind} labels={obj.metadata.labels} />
  </div>
  <div className="col-sm-4 hidden-xs">
    <Timestamp timestamp={obj.metadata.creationTimestamp} />
  </div>
  <div className="dropdown-kebab-pf">
    <ResourceKebab actions={menuActions} kind={kind} resource={obj} />
  </div>
</div>;

const Details_ = ({flags, obj: pvc}) => {
  const canListPV = flags[FLAGS.CAN_LIST_PV];
  const labelSelector = _.get(pvc, 'spec.selector');
  const storageClassName = _.get(pvc, 'spec.storageClassName');
  const volumeName = _.get(pvc, 'spec.claimRef.name');
  const volumeMode = _.get(pvc, 'status.volumeMode');
  const storage = _.get(pvc, 'spec.capacity.storage');
  const accessModes = _.get(pvc, 'spec.accessModes');
  return <div className="co-m-pane__body">
    <SectionHeading text="PersistentVolumeClaim Overview" />
    <div className="row">
      <div className="col-sm-4">
        <ResourceSummary resource={pvc} showPodSelector={false} showNodeSelector={false}>
          <dt>Label Selector</dt>
          <dd><Selector selector={labelSelector} /></dd>
        </ResourceSummary>
      </div>
      <div className="col-sm-4">
        <dl>
          <dt>Status</dt>
          <dd> <PVCStatus pvc={pvc} /> </dd>
          <dt>Capacity</dt>
          <dd>{storage}</dd>
          <dt>Used</dt>
          <dd>{'-'}</dd>
          {!_.isEmpty(accessModes) && <React.Fragment><dt>Access Modes</dt><dd>{accessModes.join(', ')}</dd></React.Fragment>}
          <dt>Volume Mode</dt>
          <dd>{volumeMode ? {volumeMode} : 'Filesystem' }</dd>
          <dt>Storage Class</dt>
          <dd>
            {storageClassName ? <ResourceLink kind="StorageClass" name={storageClassName} /> : '-'}
          </dd>
          {volumeName && canListPV && <React.Fragment>
            <dt>Persistent Volume Claim</dt>
            <dd><ResourceLink kind="PersistentVolumeClaim" name={volumeName} /></dd>
          </React.Fragment>}
        </dl>
      </div>
      <div className="col-sm-4">
        <dl>
          <PodStatusChart fetcher={() => [1,2]} statusDescriptor="Test" />
        </dl>
      </div>
    </div>
  </div>;
};

const Details = connectToFlags(FLAGS.CAN_LIST_PV)(Details_);


export const PersistentVolumesList = props => <List {...props} Header={Header} Row={Row} />;
export const PersistentVolumesPage = props => <ListPage {...props} ListComponent={PersistentVolumesList} kind={kind} canCreate={true} />;
export const PersistentVolumesDetailsPage = props => <DetailsPage
  {...props}
  menuActions={menuActions}
  pages={[navFactory.details(Details), navFactory.editYaml()]}
/>;

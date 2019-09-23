import * as React from 'react';
import { connect } from 'react-redux';
import { Card } from 'antd';
import { IStore } from 'core';

const { Meta } = Card;

function Component(props) {
  const {
    demoStore: { image = {} },
  } = props;

  return (
    <>
      {image && (
        <Card hoverable className="max-w-lg" cover={<img alt="example" src={image.url} />}>
          <Meta title={image.title} description={image.explanation} />
        </Card>
      )}
    </>
  );
}

const mapStateToProps = (state: IStore) => ({
  demoStore: state.demoStore,
});

export const Dashboard = connect(mapStateToProps)(Component);

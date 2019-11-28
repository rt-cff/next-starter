import React from 'react';
import { Card, Row, Col } from 'antd';
import { IMarsPhoto } from '@onr/demo';

interface IMarsPhotoProps {
  photos: IMarsPhoto[];
}

export const MarsPhotos: React.FC<IMarsPhotoProps> = ({ photos }: IMarsPhotoProps) => {
  return (
    <>
      <Row data-testid="row">
        {photos.map((photo, index) => (
          <Col key={index} span={6}>
            <Card className="max-w-sm" cover={<img alt="example" src={photo.img_src} />} />
          </Col>
        ))}
      </Row>
    </>
  );
};

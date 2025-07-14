import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Point } from 'geojson';

@Entity()
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ spatial: true })
  
  // Point 타입은 GeoJSON 규격 
  // ex. { type:'Point', coordinates:[126.9784, 37.5665] }
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  point: Point;

  @ManyToOne(() => User, (user) => user.id) // user.id와 연결하도록 수정
  user: User;

  @CreateDateColumn()
  timestamp: Date;
}

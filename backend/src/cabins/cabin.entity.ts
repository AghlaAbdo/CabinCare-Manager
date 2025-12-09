import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// import { MaintenanceTask } from '../maintenance-tasks/maintenance-task.entity';

@Entity('cabins')
export class Cabin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
//   Todo
//   @OneToMany(() => MaintenanceTask, (task) => task.cabin, { cascade: true })
//   maintenanceTasks: MaintenanceTask[];
}

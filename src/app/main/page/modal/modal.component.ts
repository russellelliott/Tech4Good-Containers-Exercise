import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';
import { ModalAnimations } from './modal.animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LongTermGoal } from '../../../core/store/long-term-goal/long-term-goal.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: ModalAnimations,
})
export class ModalComponent implements OnInit {
  // --------------- INPUTS AND OUTPUTS ------------------

  // --------------- LOCAL AND GLOBAL STATE --------------

  longTermData: LongTermGoal = {
    __id: '',
    __userId: '',
    oneYear: '',
    fiveYear: '',
  };

  // --------------- DATA BINDING ------------------------

  // --------------- EVENT BINDING -----------------------

  // --------------- HELPER FUNCTIONS AND OTHER ----------

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      longTermData: LongTermGoal;
      updateGoals: (ltg: LongTermGoal) => void;
    },
    private dialogRef: MatDialogRef<ModalComponent>
  ) {}

  ngOnInit(): void {
    this.longTermData.__id = this.data.longTermData.__id;
    this.longTermData.__userId = this.data.longTermData.__userId;
    this.longTermData.oneYear = this.data.longTermData.oneYear;
    this.longTermData.fiveYear = this.data.longTermData.fiveYear;
  }

  submit() {
    this.data.updateGoals(this.longTermData);
    console.log('submitted!');
    this.dialogRef.close();
  }
}

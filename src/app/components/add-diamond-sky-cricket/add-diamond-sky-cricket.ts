import {
  Component,
  OnInit,
  signal,
  inject,
  computed,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Api } from '../../core/service/api';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-add-diamond-sky-cricket',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-diamond-sky-cricket.html',
  styleUrl: './add-diamond-sky-cricket.css',
})
export class AddDiamondSkyCricket implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private apiService = inject(Api);
  private fb = inject(FormBuilder);
  sportId: any = '4';
  betfairMatchListDS = signal<any[]>([]);
  manualMatchListDS = signal<any[]>([]);
  skySrlMatchListDS = signal<any[]>([]);
  selectedSport: string = '4';
  addEventForm!: FormGroup;
  selectedEvent: any = null;

  isloading = false;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe((param: any) => {
      this.sportId = param.get('id');
      console.log(this.sportId, 'this.sportId');
      this.fetchAll_DS_EventList(this.sportId);
      this.initForm(this.selectedSport);
    });
  }

  fetchAll_DS_EventList(id: any) {
    this.isloading = true;
    this.apiService.getAllProviderEvents({ sportId: id }).subscribe({
      next: (res: any) => {
        this.isloading = false;

        const allEvents = res.data || [];
        console.log(allEvents, 'allEvents');

        // Betfair: provider = "common"
        const betfairMatchList = allEvents.filter(
          (event: any) =>
            event.isElectronic == false && event.isManualEvent == false
        );

        // Manual: provider = "sky" or "diamond" AND eventName does NOT contain "SRL"
        const manualMatchList = allEvents.filter(
          (event: any) =>
            event.isManualEvent == true && event.isElectronic == false
        );

        // Sky SRL: eventName contains "SRL"
        const skySrlMatchList = allEvents.filter(
          (event: any) => event.isElectronic == true
        );

        // ✅ Set results in signals
        this.betfairMatchListDS.set(betfairMatchList);
        this.manualMatchListDS.set(manualMatchList);
        this.skySrlMatchListDS.set(skySrlMatchList);

        console.log('✅ Manual Matches:', this.manualMatchListDS());
        console.log('✅ Betfair Matches:', this.betfairMatchListDS());
        console.log('✅ Sky SRL Matches:', this.skySrlMatchListDS());

        this.showToast('Running Matches fetched successfully');
      },
      error: (err) => {
        this.isloading = false;
        console.log('Error in getting Running Matches list: ', err);
        this.showToast(
          `Error in getting Running Matches list:${err.error.message}`,
          true
        );
      },
    });
  }

  initForm(sportId: string) {
    this.addEventForm = this.fb.group({
      competitionGrade: ['', Validators.required],
      eventGrade: ['', Validators.required],
      matchType: [''],
      premium: [null],
    });
    // 1. Competition Grade → only required if competition doesn't exist
    if (this.selectedEvent?.isCompetitionExist === false) {
      this.addEventForm
        .get('competitionGrade')
        ?.setValidators([Validators.required]);
    } else {
      this.addEventForm.get('competitionGrade')?.clearValidators();
    }
    this.addEventForm.get('competitionGrade')?.updateValueAndValidity();

    // then set validators conditionally
    if (
      sportId === '4' &&
      !this.selectedEvent?.marketName?.toLowerCase().includes('winner') &&
      this.selectedEvent?.isWinnerOpen === true
    ) {
      this.addEventForm.get('matchType')?.setValidators([Validators.required]);
      this.addEventForm.get('premium')?.setValidators([Validators.required]);
    } else {
      this.addEventForm.get('matchType')?.clearValidators();
      this.addEventForm.get('premium')?.clearValidators();
    }

    this.addEventForm.get('matchType')?.updateValueAndValidity();
    this.addEventForm.get('premium')?.updateValueAndValidity();
  }

  openModal(event: any, isWinnerOpen: boolean) {
    this.selectedEvent = event;
    this.apiService
      .competitionCheck({ competitionId: this.selectedEvent.competitionId })
      .subscribe({
        next: (res: any) => {
          this.selectedEvent.isCompetitionExist = res?.data;
          this.selectedEvent.isWinnerOpen = isWinnerOpen;
          this.cd.detectChanges(); // force refresh

          console.log(this.selectedEvent, 'this.selectedEvent-after-API');
          console.log(this.selectedEvent.isCompetitionExist,'isCompetitionExist-after-API');

          // Init form & open modal here (after we know competition exist status)
          this.initForm(this.selectedSport);
          const modalEl = document.getElementById('addEventModal');
          if (modalEl) {
            const modal = new (window as any).bootstrap.Modal(modalEl);
            modal.show();
          }
        },
        error: (err) => {
          console.log('Error in Checking competition ', err);
        },
      });
  }

  closeModal() {
    const modalEl = document.getElementById('addEventModal');
    if (modalEl) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
      if (modal) {
        modal.hide();
      }
    }
    this.addEventForm.reset();
    this.selectedEvent = null;
  }

  addEvent() {
    if (this.addEventForm.invalid) {
      Swal.fire('Error', 'Please fill all fields correctly.', 'error');
      return;
    }

    const payload = {
      ...this.selectedEvent,
      ...this.addEventForm.value,
    };

    console.log(payload,"payload")
    // if (payload) {
    //   payload.isAdded = true;
    //   this.apiService.addEvent(payload).subscribe({
    //     next: (res: any) => {
    //       this.showToast('Event Added successfully');
    //       this.closeModal();
    //       this.fetchAll_DS_EventList(this.selectedSport);
    //     },
    //     error: (err) => {
    //       this.isloading = false;
    //       console.log('Error in Adding Event: ', err);
    //       this.showToast(`Error in Adding Event:${err.error.message}`, true);
    //     },
    //   });
    // }
  }

  private showToast(message: string, isError: boolean = false): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: isError ? 'error' : 'success',
      title: message,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  }
}

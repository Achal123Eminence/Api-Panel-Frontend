import {Component, OnInit, signal, inject, computed, ChangeDetectorRef, } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Api } from '../../core/service/api';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl,} from '@angular/forms';

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
  selectedSport: any ;
  addEventForm!: FormGroup;
  selectedEvent: any = null;
  isloading = false;

  addDoubleEventForm!: FormGroup;
  selectedDoubleEvent: any = null;
  maunalCompetitionManualList = signal<any[]>([]);

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe((param: any) => {
      this.sportId = param.get('id');
      console.log(this.sportId, 'this.sportId');
      this.fetchAll_DS_EventList(this.sportId);
      this.initForm();
      this.initDoubleEventModalForm(this.sportId);
      this.selectedSport = this.sportId;
    });
  }

  fetchAll_DS_EventList(id: any) {
    // this.isloading = true;
    this.apiService.getAllProviderEvents({ sportId: id }).subscribe({
      next: (res: any) => {
        // this.isloading = false;

        const allEvents = res.data || [];
        console.log(allEvents, 'allEvents');

        // Betfair: provider = "common"
        const betfairMatchList = allEvents.filter(
          (event: any) =>
            event.provider == 'common'
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
        // this.isloading = false;
        console.log('Error in getting Running Matches list: ', err);
        this.showToast(
          `Error in getting Running Matches list:${err.error.message}`,
          true
        );
      },
    });
  }

  initForm() {
    this.addEventForm = this.fb.group({
      competitionGrade: ['', Validators.required],
      eventGrade: ['', Validators.required],
      matchType: [''],
      premium: [null],
    });
    // 🟡 Handle competition grade
    if (this.selectedEvent?.isCompetitionExist === false) {
      this.addEventForm.get('competitionGrade')?.setValidators([Validators.required]);
    } else {
      this.addEventForm.get('competitionGrade')?.clearValidators();
      this.addEventForm.patchValue({ competitionGrade: '' });
    }
    this.addEventForm.get('competitionGrade')?.updateValueAndValidity();

    // 🟡 Handle matchType & premium for Cricket
    if (
      this.selectedSport === '4' &&
      !this.selectedEvent?.marketName?.toLowerCase()?.includes('winner') &&
      this.selectedEvent?.isWinnerOpen !== true
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
          // Init form & open modal here (after we know competition exist status)
          this.initForm();
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

    let payload = {
      ...this.selectedEvent,
      ...this.addEventForm.value,
    };

    if (payload) {
      payload.isAdded = true;
      payload.mType = 'normal';
      payload.marketName = payload.marketName || '';
      payload.markets = payload.markets || [];
      this.apiService.addEvent(payload).subscribe({
        next: (res: any) => {
          this.showToast('Event Added successfully');
          this.closeModal();
          this.fetchAll_DS_EventList(this.selectedSport);
        },
        error: (err) => {
          this.isloading = false;
          console.log('Error in Adding Event: ', err);
          this.showToast(`Error in Adding Event:${err.error.message}`, true);
        },
      });
    }
  }

  // ADD DOUBLE EVENT

  initDoubleEventModalForm(sportId: string) {
    this.addDoubleEventForm = this.fb.group({
      competition: [''],
      competitionGrade: [''],
      eventGrade: ['', Validators.required],
      primaryEventId: [''],
      primaryMarketId: [''],
      altEventId: [''],
      altMarketId: [''],
      matchType: [''],
      premium: [null],
    });

    // 🟡 Handle competition fields
    if (this.selectedDoubleEvent?.isCompetitionExist === false) {
      this.addDoubleEventForm
        .get('competition')
        ?.setValidators([Validators.required]);
      this.addDoubleEventForm
        .get('competitionGrade')
        ?.setValidators([Validators.required]);
    } else {
      // remove validators & clear values
      this.addDoubleEventForm.get('competition')?.clearValidators();
      this.addDoubleEventForm.get('competitionGrade')?.clearValidators();
      this.addDoubleEventForm.patchValue({
        competition: '',
        competitionGrade: '',
      });
    }
    this.addDoubleEventForm.get('competition')?.updateValueAndValidity();
    this.addDoubleEventForm.get('competitionGrade')?.updateValueAndValidity();

    // 🟡 Handle matchType & premium (only for cricket, non-winner)
    if (
      sportId === '4' &&
      !this.selectedEvent?.marketName?.toLowerCase().includes('winner') &&
      this.selectedEvent?.isWinnerOpen !== true
    ) {
      this.addDoubleEventForm
        .get('matchType')
        ?.setValidators([Validators.required]);
      this.addDoubleEventForm
        .get('premium')
        ?.setValidators([Validators.required]);
    } else {
      this.addDoubleEventForm.get('matchType')?.clearValidators();
      this.addDoubleEventForm.get('premium')?.clearValidators();
    }
    this.addDoubleEventForm.get('matchType')?.updateValueAndValidity();
    this.addDoubleEventForm.get('premium')?.updateValueAndValidity();

    // 🟡 Handle Double event fields
    if (this.selectedDoubleEvent?.isDouble) {
      if (this.selectedDoubleEvent?.provider === 'sky') {
        this.addDoubleEventForm.patchValue({
          primaryEventId: this.selectedDoubleEvent.eventId,
          primaryMarketId: this.selectedDoubleEvent.marketId,
        });
      }

      if (this.selectedDoubleEvent?.provider === 'diamond') {
        this.addDoubleEventForm.patchValue({
          altEventId: this.selectedDoubleEvent.eventId,
          altMarketId: this.selectedDoubleEvent.marketId,
        });
      }

      // mark them required for double events
      [
        'primaryEventId',
        'primaryMarketId',
        'altEventId',
        'altMarketId',
      ].forEach((key) => {
        this.addDoubleEventForm.get(key)?.setValidators([Validators.required]);
        this.addDoubleEventForm.get(key)?.updateValueAndValidity();
      });
    } else {
      // if not double → clear fields and validators
      this.addDoubleEventForm.patchValue({
        primaryEventId: '',
        primaryMarketId: '',
        altEventId: '',
        altMarketId: '',
      });
      [
        'primaryEventId',
        'primaryMarketId',
        'altEventId',
        'altMarketId',
      ].forEach((key) => {
        this.addDoubleEventForm.get(key)?.clearValidators();
        this.addDoubleEventForm.get(key)?.updateValueAndValidity();
      });
    }
  }

  openDoubleEventModal(event: any, isDouble: boolean) {
    this.selectedDoubleEvent = event;
    this.selectedDoubleEvent.isDouble = isDouble;

    console.log(event.competitionId,"event.competitionId")
    this.apiService
      .competitionCheck({ competitionId: event.competitionId })
      .subscribe({
        next: (res: any) => {
          console.log(res,"check the res")
          this.selectedDoubleEvent.isCompetitionExist = res?.data;
          this.cd.detectChanges();

          // Init form now that we know the competition status
          this.initDoubleEventModalForm(this.selectedSport);

          // Fetch competition list if needed
          if (event.isManualEvent && !event.isElectronic) {
            this.apiService.getManualCompetitionListBySport({sportId:this.sportId}).subscribe({
              next: (res: any) => {
                res.data = res.data.filter(
                  (comp: any) => comp.competitionType == 'manual'
                );
                this.maunalCompetitionManualList.set(res.data);
                console.log(this.maunalCompetitionManualList(),"this.maunalCompetitionManualList()")
              },
            });
          }

          if (event.isElectronic) {
            this.apiService.getManualCompetitionListBySport({sportId:this.sportId}).subscribe({
              next: (res: any) => {
                res.data = res.data.filter(
                  (comp: any) => comp.competitionType == 'virtual'
                );
                this.maunalCompetitionManualList.set(res.data);
                console.log(this.maunalCompetitionManualList(),"this.maunalCompetitionManualList()")
              },
            });
          }

          // Show modal
          const modalEl = document.getElementById('addDoubleEventModal');
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

  closeDoubleEventModal() {
    const modalEl = document.getElementById('addDoubleEventModal');
    if (modalEl) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
      if (modal) {
        modal.hide();
      }
    }
    // this.addDoubleEventForm.reset();
    this.selectedDoubleEvent = null;
  }

  addDoubleEvent() {
    if (this.addDoubleEventForm.invalid) {
      Swal.fire('Error', 'Please fill all fields correctly.', 'error');
      return;
    }

    // console.log(this.selectedDoubleEvent, 'this.selectedDoubleEvent');
    // console.log(this.addDoubleEventForm.value, 'this.addDoubleEventForm.value');

    // console.log(this.addDoubleEventForm.value.competition, 'this.addDoubleEventForm.value');


    let payload = {
      ...this.selectedDoubleEvent,
      ...this.addDoubleEventForm.value,
      competitionId : this.addDoubleEventForm.value.competition.competitionId,
      competitionName : this.addDoubleEventForm.value.competition.competitionName
    };

    if (payload.competition && typeof payload.competition === 'object') {
      payload.competitionId = payload.competition.competitionId || '';
      payload.competitionName = payload.competition.competitionName || '';
      delete payload.competition;
    }

    // remove fields that shouldn’t be sent if competition exists
    if (this.selectedDoubleEvent?.isCompetitionExist === true) {
      delete payload.competition;
      delete payload.competitionGrade;
    }

    // remove double fields if not a double event
    if (!this.selectedDoubleEvent?.isDouble) {
      delete payload.primaryEventId;
      delete payload.primaryMarketId;
      delete payload.altEventId;
      delete payload.altMarketId;
    }

    console.log(payload, 'payload');
    if (payload) {
      payload.isAdded = true;
      if(payload.isElectronic == false && payload.isManualEvent == false){
        payload.mType = 'normal'
      }

      if(payload.isElectronic == false && payload.isManualEvent == true){
        payload.mType = 'manual'
      }

      if(payload.isElectronic == true){
        payload.mType = 'virtual'
      }

      payload.marketName = payload.marketName || "";
      payload.markets = payload.markets || [];
      this.apiService.addEvent(payload).subscribe({
        next: (res: any) => {
          this.showToast('Event Added successfully');
          this.closeDoubleEventModal();
          this.fetchAll_DS_EventList(this.selectedSport);
        },
        error: (err) => {
          this.isloading = false;
          console.log('Error in Adding Event: ', err);
          this.showToast(`Error in Adding Event:${err.error.message}`, true);
        },
      });
    }
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

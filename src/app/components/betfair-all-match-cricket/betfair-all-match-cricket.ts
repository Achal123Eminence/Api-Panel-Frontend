import { Component, OnInit, signal, inject, computed,ChangeDetectorRef  } from '@angular/core';
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
} from '@angular/forms';

@Component({
  selector: 'app-betfair-all-match-cricket',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './betfair-all-match-cricket.html',
  styleUrl: './betfair-all-match-cricket.css',
})
export class BetfairAllMatchCricket implements OnInit {
  private apiService = inject(Api);
  private fb = inject(FormBuilder);
  cricketAllEventList = signal<any[]>([]);
  isloading = false;
  Math = Math;
  selectedSport: string = '4';
  addEventForm!: FormGroup;
  selectedEvent: any = null;

  // Pagination state
  pageSize = signal<number>(50);
  searchTerm = signal('');
  currentPage = signal(1);

  // Derived data using Angular Signals
  filteredList = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.cricketAllEventList().filter((item) =>
      item.eventName.toLowerCase().includes(term)
    );
  });

  paginatedList = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredList().slice(start, start + this.pageSize());
  });

  totalPages = computed(
    () => Math.ceil(this.filteredList().length / this.pageSize()) || 1
  );

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchCricketAllEventList(this.selectedSport);
    this.initForm(this.selectedSport);
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

  // openModal(event: any, isWinnerOpen: Boolean) {
  //   this.selectedEvent = event;
  //   console.log(this.selectedEvent.competitionId,"this.selectedEvent.competitionId")
  //   this.apiService.competitionCheck({competitionId:this.selectedEvent.competitionId}).subscribe({
  //     next: (res:any) => {
  //       console.log(res?.data,"res?.data")
  //       this.selectedEvent.isCompetitionExist = res?.data;
  //     },
  //     error:(err) => {
  //       console.log('Error in Checking competition ', err);
  //     }
  //   })
  //   this.selectedEvent.isWinnerOpen = isWinnerOpen;

  //   console.log(this.selectedEvent,"this.selectedEvent-this.selectedEvent")
  //   console.log(this.selectedEvent.isCompetitionExist,"isCompetitionExist-isCompetitionExist---this.selectedEvent-this.selectedEvent")
  //   this.initForm(this.selectedSport);
  //   const modalEl = document.getElementById('addEventModal');
  //   if (modalEl) {
  //     const modal = new (window as any).bootstrap.Modal(modalEl);
  //     modal.show();
  //   }
  // }

  openModal(event: any, isWinnerOpen: boolean) {
    this.selectedEvent = event;
    console.log(
      this.selectedEvent.competitionId,
      'this.selectedEvent.competitionId'
    );

    this.apiService
      .competitionCheck({ competitionId: this.selectedEvent.competitionId })
      .subscribe({
        next: (res: any) => {
          console.log(res?.data, 'res?.data');
          this.selectedEvent.isCompetitionExist = res?.data;
          this.selectedEvent.isWinnerOpen = isWinnerOpen;
          this.cd.detectChanges(); // force refresh

          console.log(this.selectedEvent, 'this.selectedEvent-after-API');
          console.log(
            this.selectedEvent.isCompetitionExist,
            'isCompetitionExist-after-API'
          );

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
  }

  fetchCricketAllEventList(id: any) {
    this.selectedSport = id;
    this.isloading = true;
    this.apiService.getAllEvents({ sportId: id }).subscribe({
      next: (res: any) => {
        this.isloading = false;
        this.cricketAllEventList.set(res.events);
        console.log(this.cricketAllEventList());
        // this.showToast('Cricket All Event list fetched successfully');
        this.currentPage.set(1);
      },
      error: (err) => {
        this.isloading = false;
        console.log('Error in getting cricket all event list: ', err);
        this.showToast(
          `Error in getting cricket all event list:${err.error.message}`,
          true
        );
      },
    });
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

    if (payload) {
      payload.isAdded = true;
      payload.mType = 'normal';
      this.apiService.addEvent(payload).subscribe({
        next: (res: any) => {
          this.showToast('Event Added successfully');
          this.closeModal();
          this.fetchCricketAllEventList(this.selectedSport);
        },
        error: (err) => {
          this.isloading = false;
          console.log('Error in Adding Event: ', err);
          this.showToast(`Error in Adding Event:${err.error.message}`, true);
        },
      });
    }
  }

  isCupWinner(item: any): boolean {
    return item.marketName?.toLowerCase().includes('winner') && !item.isAdded;
  }

  setPageSize(event: Event) {
    const select = event.target as HTMLSelectElement | null;
    if (select) {
      this.pageSize.set(Number(select.value));
      this.currentPage.set(1);
    }
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.currentPage.set(1);
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

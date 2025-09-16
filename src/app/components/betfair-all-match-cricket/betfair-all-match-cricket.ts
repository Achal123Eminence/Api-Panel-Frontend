import { Component, OnInit, signal, inject,computed } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Api } from '../../core/service/api';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule,FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

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

  constructor() {}

  ngOnInit(): void {
    this.fetchCricketAllEventList(this.selectedSport);
    this.initForm(this.selectedSport);
  }

  initForm(sportId: string) {
    if (sportId === '4' && this.selectedEvent?.marketName !== 'Winner') {
      // Cricket events (non-winner)
      this.addEventForm = this.fb.group({
        competitionGrade: ['', Validators.required],
        eventGrade: ['', Validators.required],
        matchType: ['', Validators.required],
        premium: [null, Validators.required],
      });
    } else {
      // Soccer, Tennis, OR Cricket Winner market
      this.addEventForm = this.fb.group({
        competitionGrade: ['', Validators.required],
        eventGrade: ['', Validators.required],
      });
    }
  }

  openModal(event: any, isWinnerOpen:Boolean) {
    this.selectedEvent = event;
    this.selectedEvent.isWinnerOpen = isWinnerOpen
    this.initForm(this.selectedSport);
    const modalEl = document.getElementById('addEventModal');
    if (modalEl) {
      const modal = new (window as any).bootstrap.Modal(modalEl);
      modal.show();
    }
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
    this.apiService.getAllEvents(id).subscribe({
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

    console.log(payload);
    if (payload) {
      payload.isAdded = true;
      console.log(payload, 'payload');
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

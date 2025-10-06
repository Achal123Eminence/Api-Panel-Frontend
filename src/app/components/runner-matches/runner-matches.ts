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
  selector: 'app-runner-matches',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './runner-matches.html',
  styleUrl: './runner-matches.css',
})
export class RunnerMatches implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private apiService = inject(Api);
  private fb = inject(FormBuilder);
  cricketAllEventList = signal<any[]>([]);
  isloading = false;
  Math = Math;
  sportId: any;
  updateMatchTypeForm!: FormGroup;
  updateMatchDateForm!: FormGroup;
  updateMatchRunnersForm!: FormGroup;
  updateMatchBookmaker!: FormGroup;
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
    this.activeRoute.paramMap.subscribe((param: any) => {
      this.sportId = param.get('id');
      this.fetchCricketAllEventList(this.sportId);
      this.initForm();
      this.initFormOpenDate();
      this.initFormRunners();
      this.initFormBookmaker();
      console.log(this.sportId, 'this.sportId');
    });
  }

  initForm() {
    this.updateMatchTypeForm = this.fb.group({
      matchType: ['', Validators.required],
      premium: ['', Validators.required],
    });

    this.updateMatchTypeForm.get('matchType')?.updateValueAndValidity();
    this.updateMatchTypeForm.get('premium')?.updateValueAndValidity();
  }

  openModal(event: any) {
    this.selectedEvent = event;

    this.initForm();
    const modalEl = document.getElementById('updateEventModal');
    if (modalEl) {
      const modal = new (window as any).bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  closeModal() {
    const modalEl = document.getElementById('updateEventModal');
    if (modalEl) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
      if (modal) {
        modal.hide();
      }
    }
    this.updateMatchTypeForm.reset();
    this.selectedEvent = null;
  }

  initFormOpenDate() {
    this.updateMatchDateForm = this.fb.group({
      openDate: ['', Validators.required],
    });

    this.updateMatchDateForm.get('openDate')?.updateValueAndValidity();
  }

  openModalOpenDate(event: any) {
    this.selectedEvent = event;

    this.initFormOpenDate();
    const modalEl = document.getElementById('updateEventOpenDateModal');
    if (modalEl) {
      const modal = new (window as any).bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  closeModalOpenDate() {
    const modalEl = document.getElementById('updateEventOpenDateModal');
    if (modalEl) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
      if (modal) {
        modal.hide();
      }
    }
    this.updateMatchDateForm.reset();
    this.selectedEvent = null;
  }

  initFormRunners() {
    this.updateMatchRunnersForm = this.fb.group({
      runners: this.fb.array([]), // create runners form array
    });
  }

  get runnersFormArray(): FormArray {
    return this.updateMatchRunnersForm.get('runners') as FormArray;
  }

  openModalRunners(event: any) {
    this.selectedEvent = event;
    this.initFormRunners();

    if (this.selectedEvent?.matchRunners?.length) {
      this.selectedEvent.matchRunners.forEach((runner: any) => {
        this.runnersFormArray.push(
          this.fb.group({
            selectionId: [runner.selectionId],
            runnerName: [runner.runnerName, Validators.required],
          })
        );
      });
    }

    const modalEl = document.getElementById('updateEventRunnersModal');
    if (modalEl) {
      const modal = new (window as any).bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  closeModalRunners() {
    const modalEl = document.getElementById('updateEventRunnersModal');
    if (modalEl) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
      if (modal) {
        modal.hide();
      }
    }
    this.updateMatchRunnersForm.reset();
    this.selectedEvent = null;
  }

  initFormBookmaker() {
    this.updateMatchBookmaker = this.fb.group({
      worldBookmakerType: ['', Validators.required],
    });

    this.updateMatchBookmaker.get('bookmaker')?.updateValueAndValidity();
  }

  openModalBookmaker(event: any) {
    this.selectedEvent = event;

    this.initFormBookmaker();

    // Prefill the form with existing value
    this.updateMatchBookmaker.patchValue({
      worldBookmakerType: this.selectedEvent?.worldBookmakerType || '',
    });

    const modalEl = document.getElementById('updateMatchBookmakerModal');
    if (modalEl) {
      const modal = new (window as any).bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  closeModalBookmaker() {
    const modalEl = document.getElementById('updateMatchBookmakerModal');
    if (modalEl) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
      if (modal) {
        modal.hide();
      }
    }
    this.updateMatchBookmaker.reset();
    this.selectedEvent = null;
  }

  fetchCricketAllEventList(id: any) {
    this.isloading = true;
    this.apiService.getRunningEventList({ sportId: id }).subscribe({
      next: (res: any) => {
        this.isloading = false;
        this.cricketAllEventList.set(res.data);
        console.log(this.cricketAllEventList());
        this.showToast('Running Matches fetched successfully');
        this.currentPage.set(1);
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

  updateEventMarketType() {
    if (this.updateMatchTypeForm.invalid) {
      Swal.fire('Error', 'Please fill all fields correctly.', 'error');
      return;
    }

    const payload = {
      ...this.selectedEvent,
      ...this.updateMatchTypeForm.value,
    };

    console.log(payload, 'payload');

    if (payload) {
      payload.isAdded = true;
      this.apiService.updateRunningEventType(payload).subscribe({
        next: (res: any) => {
          this.showToast('Event Updated successfully');
          this.closeModal();
          this.fetchCricketAllEventList(this.sportId);
        },
        error: (err) => {
          this.isloading = false;
          console.log('Error in Updating Event: ', err);
          this.showToast(`Error in Updating Event:${err.error.message}`, true);
        },
      });
    }
  }

  updateEventOpenDate() {
    if (this.updateMatchDateForm.invalid) {
      Swal.fire('Error', 'Please fill all fields correctly.', 'error');
      return;
    }

    const payload = {
      ...this.selectedEvent,
      ...this.updateMatchDateForm.value,
    };

    console.log(payload, 'payload');

    // Convert ISO string to Date
    const date = new Date(payload.openDate);

    // Format: MM/DD/YYYY HH:mm:ss AM/PM
    payload.openDate = date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    console.log(payload, 'payload with formatted date');

    if (payload) {
      payload.isAdded = true;
      this.apiService.updateRunningEventOpenDate(payload).subscribe({
        next: (res: any) => {
          this.showToast('Event Updated successfully');
          this.closeModalOpenDate();
          this.fetchCricketAllEventList(this.sportId);
          this.selectedEvent = null;
        },
        error: (err) => {
          this.isloading = false;
          console.log('Error in Updating Event: ', err);
          this.showToast(`Error in Updating Event:${err.error.message}`, true);
        },
      });
    }
  }

  updateEventRunners() {
    if (this.updateMatchRunnersForm.invalid) {
      Swal.fire('Error', 'Please fill all fields correctly.', 'error');
      return;
    }

    const payload = {
      ...this.selectedEvent,
      ...this.updateMatchRunnersForm.value,
    };

    console.log(payload, 'payload');

    if (payload) {
      this.apiService.updateRunningEventRunners(payload).subscribe({
        next: (res: any) => {
          this.showToast('Runners Updated successfully');
          this.closeModalRunners();
          this.fetchCricketAllEventList(this.sportId);
        },
        error: (err) => {
          this.isloading = false;
          console.log('Error in Updating Event: ', err);
          this.showToast(`Error in Updating Event:${err.error.message}`, true);
        },
      });
    }
  }

  updateEventBookmaker() {
    if (this.updateMatchBookmaker.invalid) {
      Swal.fire('Error', 'Please fill all fields correctly.', 'error');
      return;
    }

    const payload = {
      ...this.selectedEvent,
      ...this.updateMatchBookmaker.value,
    };

    console.log(payload, 'payload');

    if (payload) {
      this.apiService.updateRunningBookmaker(payload).subscribe({
        next: (res: any) => {
          this.showToast('Match Bookmaker Updated successfully');
          this.closeModalBookmaker();
          this.fetchCricketAllEventList(this.sportId);
          this.selectedEvent = null;
        },
        error: (err) => {
          this.isloading = false;
          console.log('Error in Updating Match Bookmaker: ', err);
          this.showToast(`Error in Updating Match Bookmaker:${err.error.message}`, true);
        },
      });
    }
  }

  deleteEvent(data: any) {
    const payload = {
      _id: data._id,
    };

    console.log(payload, 'payload');

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to Delete this Match?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.isloading = true;
        this.apiService.deleteEvent(payload).subscribe({
          next: (res: any) => {
            this.isloading = false;
            this.fetchCricketAllEventList(this.sportId);
            this.showToast('Event Deleted successfully');
          },
          error: (err) => {
            this.isloading = false;
            this.fetchCricketAllEventList(this.sportId);
            this.showToast(
              `Failed to Deleted Event: ${err.error.message}`,
              true
            );
          },
        });
      }
    });
  }

  removeEvent(data: any) {
    const payload = {
      _id: data._id,
    };

    console.log(payload, 'payload');

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to Remove this Match?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.isloading = true;
        this.apiService.removeEvent(payload).subscribe({
          next: (res: any) => {
            this.isloading = false;
            this.fetchCricketAllEventList(this.sportId);
            this.showToast('Event Removed successfully');
          },
          error: (err) => {
            this.isloading = false;
            this.fetchCricketAllEventList(this.sportId);
            this.showToast(
              `Failed to Remove Event: ${err.error.message}`,
              true
            );
          },
        });
      }
    });
  }

  rollBackEvent(data: any) {
    const payload = {
      _id: data._id,
    };
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to Rollback this Match?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Rollback it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.isloading = true;
        this.apiService.rollBackEvent(payload).subscribe({
          next: (res: any) => {
            this.isloading = false;
            this.fetchCricketAllEventList(this.sportId);
            this.showToast('Event Rollbacked successfully');
          },
          error: (err) => {
            this.isloading = false;
            this.fetchCricketAllEventList(this.sportId);
            this.showToast(
              `Failed to Rollback Event: ${err.error.message}`,
              true
            );
          },
        });
      }
    });
  }

  allowAlphaNumeric(event: KeyboardEvent) {
    const char = event.key;
    // allow only a-z, A-Z, 0-9
    if (!/^[a-zA-Z0-9\s]$/.test(char)) {
      event.preventDefault();
    }
  }

  onAlphaNumericPaste(event: ClipboardEvent) {
    const pasteData = event.clipboardData?.getData('text') || '';
    if (!/^[a-zA-Z0-9\s]+$/.test(pasteData)) {
      event.preventDefault();
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

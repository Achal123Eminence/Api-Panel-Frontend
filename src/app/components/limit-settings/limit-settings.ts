import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Api } from '../../core/service/api';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-limit-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './limit-settings.html',
  styleUrl: './limit-settings.css',
})
export class LimitSettings implements OnInit {
  private apiService = inject(Api);

  selectedSport: string = '4';
  isloading = false;
  allCompetitionList = signal<any[]>([]);

  expandedCompetition: string | null = null;
  expandedCompetitionDefault: string | null = null;
  expandedMatch: { compIndex: number; matchIndex: number } | null = null;

  constructor() {}

  ngOnInit(): void {
    this.getCompetitionList(this.selectedSport);
  }

  toggleCompetition(comp: any) {
    // If clicking the same competition, collapse it
    if (this.expandedCompetition === comp.competitionId) {
      this.expandedCompetition = null;
    } else {
      this.expandedCompetition = comp.competitionId;
    }

    // Close Default Markets if open
    this.expandedCompetitionDefault = null;
    this.expandedMatch = null;
  }

  toggleCompetitionDefault(comp: any) {
    // If clicking the same competition, collapse it
    if (this.expandedCompetitionDefault === comp.competitionId) {
      this.expandedCompetitionDefault = null;
    } else {
      this.expandedCompetitionDefault = comp.competitionId;
    }

    // Close Matches if open
    this.expandedCompetition = null;
    this.expandedMatch = null;
  }

  toggleMatch(compIndex: number, matchIndex: number) {
    if (
      this.expandedMatch &&
      this.expandedMatch.compIndex === compIndex &&
      this.expandedMatch.matchIndex === matchIndex
    ) {
      this.expandedMatch = null;
    } else {
      this.expandedMatch = { compIndex, matchIndex };
    }
  }

  getCompetitionList(sportId: any) {
    this.isloading = true;
    this.selectedSport = sportId;
    this.apiService.getBetfairCompetitionList({ sportId }).subscribe({
      next: (res: any) => {
        this.isloading = false;
        this.allCompetitionList.set(res.data);
        console.log(this.allCompetitionList(), 'Fetched all competition');
      },
      error: (err) => {
        this.isloading = false;
        console.log('Error in fetching competition list');
      },
    });
  }

  updateCompetiitonGrade(data: any) {
    const payload = {
      _id: data._id,
      competitionGrade: data.competitionGrade,
      competitionId: data.competitionId,
    };

    console.log(payload, 'payload');

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this Competition Grade?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.updateCompetitionGrade(payload).subscribe({
          next: (res: any) => {
            this.getCompetitionList(this.selectedSport);
            this.showToast('Competition Grade updated successfully');
          },
          error: (err) => {
            this.getCompetitionList(this.selectedSport);
            this.showToast(
              `Failed to update Competition Grade: ${err.error.message}`,
              true
            );
          },
        });
      }
    });
  }

  deleteCompetiiton(data: any) {
    const payload = {
      _id: data._id,
      competitionId: data.competitionId,
    };

    console.log(payload, 'payload');

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to Delete this Competition?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteCompetition(payload).subscribe({
          next: (res: any) => {
            this.getCompetitionList(this.selectedSport);
            this.showToast('Competition Deleted successfully');
          },
          error: (err) => {
            this.getCompetitionList(this.selectedSport);
            this.showToast(
              `Failed to Deleted Competition: ${err.error.message}`,
              true
            );
          },
        });
      }
    });
  }

  updateEventGrade(data:any){
    const payload = data;

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this Match Grade?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.updateEventGrade(payload).subscribe({
          next: (res: any) => {
            this.getCompetitionList(this.selectedSport);
            this.showToast('Match Grade updated successfully');
          },
          error: (err) => {
            this.getCompetitionList(this.selectedSport);
            this.showToast(
              `Failed to update Match Grade: ${err.error.message}`,
              true
            );
          },
        });
      }
    });
  }

  deleteEvent(data: any) {
    const payload = {
      _id: data._id
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
        this.apiService.deleteEvent(payload).subscribe({
          next: (res: any) => {
            this.getCompetitionList(this.selectedSport);
            this.showToast('Event Deleted successfully');
          },
          error: (err) => {
            this.getCompetitionList(this.selectedSport);
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
      _id: data._id
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
        this.apiService.removeEvent(payload).subscribe({
          next: (res: any) => {
            this.getCompetitionList(this.selectedSport);
            this.showToast('Event Removed successfully');
          },
          error: (err) => {
            this.getCompetitionList(this.selectedSport);
            this.showToast(
              `Failed to Remove Event: ${err.error.message}`,
              true
            );
          },
        });
      }
    });
  }

  updateCompetitiondefaultSetting(competitionId:any,market:any){
    console.log(competitionId,"data from competition default",market);
    const payload = {
      status: market.status,
      marketId: market.marketId,
      competitionId: competitionId,
      updatedLimits:market.limit[0]
    };

    console.log(payload, 'payload');

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this Competition Market?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.updateCompetitionMarket(payload).subscribe({
          next: (res: any) => {
            this.getCompetitionList(this.selectedSport);
            this.showToast('Competition Market updated successfully');
          },
          error: (err) => {
            this.getCompetitionList(this.selectedSport);
            this.showToast(
              `Failed to update Competition Market: ${err.error.message}`,
              true
            );
          },
        });
      }
    });
  }

  updateEventDefaultSetting(eventId:any,market:any){
    console.log(eventId,"data from Event default",market);
    const payload = {
      status: market.status,
      marketId: market.marketId,
      eventId: eventId,
      updatedLimits:market.limit[0]
    };

    console.log(payload, 'payload');

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this Event Market?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.updateEventMarket(payload).subscribe({
          next: (res: any) => {
            this.getCompetitionList(this.selectedSport);
            this.showToast('Event Market updated successfully');
          },
          error: (err) => {
            this.getCompetitionList(this.selectedSport);
            this.showToast(
              `Failed to update Event Market: ${err.error.message}`,
              true
            );
          },
        });
      }
    });
  }

  allowDecimal(event: KeyboardEvent) {
    const char = event.key;
    const input = event.target as HTMLInputElement; // direct input element
    const currentValue = input.value || '';

    // Allow digits 0–9
    if (/^[0-9]$/.test(char)) {
      return;
    }

    // Allow only one decimal point
    if (char === '.' && !currentValue.includes('.')) {
      return;
    }

    // Block everything else
    event.preventDefault();
  }

  onDecimalPaste(event: ClipboardEvent) {
    const pasteData = event.clipboardData?.getData('text') || '';
    // Allow only numbers with a single decimal point
    if (!/^\d*\.?\d*$/.test(pasteData)) {
      event.preventDefault();
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

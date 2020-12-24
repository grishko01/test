import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {interval, Observable, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {
  private timer$!: Observable<number>;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private _time!: number;
  private lastClick!: number;
  public timerOn!: boolean;
  constructor() { }

  ngOnInit(): void {
    this.timer$ = interval(1000);
    this.initCountdown();
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private initCountdown() {
    this.timer$
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.timerOn = true;
        this.timerHandler(res);
      })
  }

  public get time(): number {
    return this.convertTime(this._time);
  }

  public set time(time: number) {
    this._time = time;
  }

  private timerHandler(passedTime: number): void {
    this.time =  passedTime;
  }

  public resetTimer(): void {
    this.destroy$.next();
    this.initCountdown();
  }
  public startTimer(): void {
    this.initCountdown();
  }
  public stopTimer(): void {
    this.timerOn = false;
    this.timerHandler(0)
    this.destroy$.next();
  }
  public waitTimer(): void {
    let d = new Date();
    let t = d.getTime();
    if(t - this.lastClick < 300) {
      this.destroy$.next();
      this.timerOn = false;
    }
    this.lastClick = t;
  }
  public convertTime(time: number): number {
    return time * 1000;
  }
}

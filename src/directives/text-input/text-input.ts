import { Directive, Self } from '@angular/core';
import { TextInput } from 'ionic-angular';
import { hasPointerMoved, pointerCoord } from 'ionic-angular/util/dom';

/**
 * Generated class for the TextInputDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
/*@Directive({
  selector: '[text-input]' // Attribute selector
})*/
@Directive({ selector: 'ion-input,ion-textarea' })
export class TextInputDirective {

  /*constructor() {
    console.log('Hello TextInputDirective Directive');
  }*/
  constructor(@Self() textInput: TextInput) {
    textInput._pointerEnd = TextInputDirective.__pointerEnd.bind(textInput);
  }

  private static __pointerEnd = function(this: TextInput, ev: UIEvent) {
      if ((this._isTouch && ev.type === 'mouseup') || !(this as any)._app.isEnabled()) {
          // the app is actively doing something right now
          // don't try to scroll in the input
          ev.preventDefault();
          ev.stopPropagation();
      } else if (this._coord) {
          // get where the touchend/mouseup ended
          const endCoord = pointerCoord(ev);

          // focus this input if the pointer hasn't moved XX pixels
          // and the input doesn't already have focus
          if (!hasPointerMoved(8, this._coord, endCoord) && !this.isFocus()) {
              // ev.preventDefault(); @see https://github.com/ionic-team/ionic-v3/issues/1049
              ev.stopPropagation();

              // begin the input focus process
              this._jsSetFocus();
          }
      }

      this._coord = null;
  };

}

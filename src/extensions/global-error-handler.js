// import Vue from "vue";

// Vue.config.errorHandler = () => {
//   if (!window['pp-server-maintenance-modal']) {
//     const modalContainer = document.getElementById("modals");
//     const modal = document.createElement("div");
//     modal.innerHTML = `
//       <div id="global-error-modal" class="c-overlay open global-error-modal">
//         <div class="global-error-modal-content">
//           <div class="c-modal-header t-modal-header header">
//             <div><span class="fa fa-warning"></span></div>
//             <div id="global-error-modal-close-btn" class="c-modal-header-close" (click)="dismiss.emit()"></div>
//           </div>
//           <div class="c-modal-body-2 body">
//             <p>
//               Uh oh,
//               something went wrong. A report has been created and we will work on getting this fixed as soon as we can.
//               <br><br>You may try again and, if you´d like, we would be happy to get your input at:
//               <a class="email" title="support@prepaird.com" href="#" onclick="javascript:window.location='mailto:support@prepaird.com?subject=Support information&body=I´ve got an error when visiting: ' + window.location + '%0D%0A%0D%0ADescription of what happened:%0D%0A%0D%0A'">support@prepaird.com</a>
//             </p>
//             <p>
//               Click OK to go back to Home.
//             </p>
//           </div>
//           <div class="c-modal-footer c-button-container">
//             <button id="global-error-modal-ok-btn" class="c-action-button">OK</button>
//           </div>
//         </div>
//       </div>
//     `;
//     modalContainer.appendChild(modal);
//     document.getElementById("global-error-modal-close-btn").onclick = () => {
//       modalContainer.removeChild(modal);
//     };
//     document.body.classList.add("modal-open");
//     document.getElementById("global-error-modal-ok-btn").onclick = () => {
//       document.body.classList.remove("modal-open");
//       window.location.href =
//         window.location.protocol +
//         "//" +
//         window.location.host +
//         window.location.pathname;
//     };
//   }
// };

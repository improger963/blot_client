// src/components/DepositFlow.tsx

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import QRCode from 'react-qr-code';
import { createDepositRequest } from '../services/dataService';
import type { CreateDepositPayload, DepositConfigResponse } from '../types/api';
import { Button, Input, Skeleton } from './ui';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { showError, showSuccess } from '../lib/notifications';
import { motion, AnimatePresence } from 'framer-motion';
import { CopyIcon, CheckIcon, ArrowLeftIcon, WalletIcon, QrCodeIcon } from './icons';

// --- Компонент Шага 1: Выбор способа оплаты ---
const Step1Form = ({ config, onSubmit, isLoading }: { config: DepositConfigResponse, onSubmit: SubmitHandler<CreateDepositPayload>, isLoading: boolean }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CreateDepositPayload>({
    defaultValues: {
      amount: 100,
      payment_method: config.payment_methods?.[0]?.id || ''
    }
  });
  
  const amount = watch('amount');
  const paymentMethod = watch('payment_method');
  
  // Preset amounts for quick selection
  const presetAmounts = [50, 100, 250, 500, 1000];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Заголовок шага */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <motion.div 
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20"
            whileHover={{ 
              scale: 1.1,
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 0.5 }}
          >
            <WalletIcon className="h-6 w-6 text-primary" />
          </motion.div>
        </div>
        <h3 className="text-lg font-semibold text-foreground">Пополнение баланса</h3>
        <p className="text-sm text-muted-foreground">
          Выберите сумму и способ оплаты
        </p>
      </div>

      {/* Блок выбора суммы */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">💰 Сумма пополнения</h4>
        
        {/* Пресеты сумм */}
        <div className="grid grid-cols-5 gap-2">
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                // This is a workaround since we can't directly set the value with react-hook-form in this context
                const amountInput = document.getElementById('amount') as HTMLInputElement;
                if (amountInput) {
                  amountInput.value = preset.toString();
                  // Trigger the input event to update react-hook-form
                  const event = new Event('input', { bubbles: true });
                  amountInput.dispatchEvent(event);
                }
              }}
              className={`py-2 rounded-lg text-sm font-medium transition-all ${
                amount === preset
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'bg-card text-foreground hover:bg-surface border border-border/40'
              }`}
            >
              ${preset}
            </button>
          ))}
        </div>
        
        {/* Ручной ввод суммы */}
        <Input
          id="amount"
          type="number"
          step="0.01"
          variant="filled"
          isError={!!errors.amount}
          placeholder={`От ${config.min_amount} до ${config.max_amount} USD`}
          {...register('amount', {
            required: 'Сумма обязательна',
            valueAsNumber: true,
            min: { value: config.min_amount, message: `Минимальная сумма: ${config.min_amount}` },
            max: { value: config.max_amount, message: `Максимальная сумма: ${config.max_amount}` },
          })}
        />
        {errors.amount && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-400 flex items-center gap-1"
          >
            ⚠️ {errors.amount.message}
          </motion.p>
        )}
      </div>

      {/* Выбор валюты */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">💱 Валюта депозита</h4>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className={`py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              paymentMethod === 'ton'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                : 'bg-card text-foreground hover:bg-surface border border-border/40'
            }`}
            onClick={() => {
              const methodInput = document.getElementById('payment_method') as HTMLInputElement;
              if (methodInput) {
                methodInput.value = 'ton';
                const event = new Event('change', { bubbles: true });
                methodInput.dispatchEvent(event);
              }
            }}
          >
            <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">T</div>
            TON
          </button>
          <button
            type="button"
            className={`py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              paymentMethod === 'usdt'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'bg-card text-foreground hover:bg-surface border border-border/40'
            }`}
            onClick={() => {
              const methodInput = document.getElementById('payment_method') as HTMLInputElement;
              if (methodInput) {
                methodInput.value = 'usdt';
                const event = new Event('change', { bubbles: true });
                methodInput.dispatchEvent(event);
              }
            }}
          >
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">U</div>
            USDT TON
          </button>
        </div>
        
        {/* Hidden select for react-hook-form */}
        <select
          id="payment_method"
          className="hidden"
          {...register('payment_method')}
        >
          <option value="ton">TON</option>
          <option value="usdt">USDT TON</option>
        </select>
      </div>

      {/* Блок шагов */}
      <div className="flex items-center justify-center">
        <div className="flex items-center">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-xs mt-1 text-primary font-medium">1</span>
          </div>
          <div className="w-16 h-0.5 bg-primary"></div>
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-border/40"></div>
            <span className="text-xs mt-1 text-muted-foreground">2</span>
          </div>
        </div>
      </div>

      {/* Кнопки */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" className="h-12 rounded-xl font-semibold">
          Назад
        </Button>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleSubmit(onSubmit)}
            className="w-full h-12 rounded-xl font-semibold shadow-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
            isLoading={isLoading}
          >
            {isLoading ? 'Обработка...' : 'Продолжить'}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- Компонент Шага 2: Отправка ---
const Step2Instructions = ({ address, amount, onBack }: { address: string, amount: number, onBack: () => void }) => {
  const { isCopied, copiedText, copy } = useCopyToClipboard();

  const handleCopyAddress = () => {
    copy(address);
  };

  const handleCopyAmount = () => {
    copy(amount.toString());
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Заголовок шага */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <motion.div 
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20"
            whileHover={{ 
              scale: 1.1,
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 0.5 }}
          >
            <QrCodeIcon className="h-6 w-6 text-primary" />
          </motion.div>
        </div>
        <h3 className="text-lg font-semibold text-foreground">Отправить</h3>
        <p className="text-sm text-muted-foreground">
          Отправьте точную сумму на адрес ниже
        </p>
      </div>

      {/* Блок шагов */}
      <div className="flex items-center justify-center">
        <div className="flex items-center">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-border/40"></div>
            <span className="text-xs mt-1 text-muted-foreground">1</span>
          </div>
          <div className="w-16 h-0.5 bg-border/40"></div>
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-xs mt-1 text-primary font-medium">2</span>
          </div>
        </div>
      </div>

      {/* Блок суммы */}
      <div className="rounded-xl bg-card/30 border border-border/40 p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground">Сумма</p>
            <p className="text-lg font-bold text-foreground">${amount.toFixed(2)}</p>
          </div>
          <Button 
            onClick={handleCopyAmount}
            className="h-8 rounded-lg px-3 text-xs font-medium bg-card hover:bg-surface border border-border/40"
          >
            {isCopied && copiedText === amount.toString() ? '✓ Скопировано' : '📋 Копировать'}
          </Button>
        </div>
        <div className="mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-xs text-yellow-500 flex items-center gap-1">
            ⚠️ Отправьте точную сумму, иначе транзакция не будет зачислена
          </p>
        </div>
      </div>

      {/* Адрес и QR-код */}
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="rounded-2xl bg-white p-4 border border-border/40 shadow-lg">
            <QRCode value={address} size={160} />
          </div>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground text-center">Адрес кошелька</p>
          <div className="relative">
            <div className="break-words rounded-xl bg-card/50 border border-border/40 p-4 font-mono text-sm text-foreground pr-12">
              {address}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyAddress}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors"
            >
              {isCopied && copiedText === address ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Кнопки */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="secondary"
            onClick={onBack}
            className="w-full h-12 rounded-xl font-semibold flex items-center justify-center"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Назад
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleCopyAddress}
            className="w-full h-12 rounded-xl font-semibold shadow-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
          >
            {isCopied && copiedText === address ? '✓ Скопировано' : '📋 Копировать адрес'}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- Основной компонент ---
export const DepositFlow = ({ onSuccess, config, isLoadingConfig }: { onSuccess?: () => void, config: DepositConfigResponse | undefined, isLoadingConfig: boolean }) => {
    const [step, setStep] = useState(1);
    const [depositDetails, setDepositDetails] = useState<{ deposit_address: string; amount: number } | null>(null);
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: (payload: CreateDepositPayload) => createDepositRequest(payload),
        onSuccess: (data) => {
            showSuccess('Адрес для пополнения сгенерирован!');
            setDepositDetails(data);
            setStep(2);
            queryClient.invalidateQueries({ queryKey: ['walletHistory'] });
            if (onSuccess) {
                onSuccess();
            }
        },
        onError: (err) => showError(err.message),
    });

    const handleFormSubmit: SubmitHandler<CreateDepositPayload> = (data) => {
        mutate(data);
    };

    const handleBack = () => {
        setStep(1);
        setDepositDetails(null);
    };

    if (isLoadingConfig) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-12 w-32 mx-auto bg-card/60 rounded-xl" />
                <Skeleton className="h-16 bg-card/60 rounded-xl" />
                <Skeleton className="h-16 bg-card/60 rounded-xl" />
                <Skeleton className="h-12 bg-card/60 rounded-xl" />
            </div>
        );
    }

    if (!config) {
        return (
            <div className="text-center space-y-4 py-8">
                <div className="text-red-400 text-4xl">⚠️</div>
                <h3 className="text-lg font-semibold text-foreground">Ошибка загрузки</h3>
                <p className="text-sm text-muted-foreground">Не удалось загрузить способы оплаты</p>
                <Button onClick={() => window.location.reload()} variant="secondary">
                    Попробовать снова
                </Button>
            </div>
        );
    }

    return (
        <div className="relative">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <Step1Form
                        key="step1"
                        config={config}
                        onSubmit={handleFormSubmit}
                        isLoading={isPending}
                    />
                )}
                {step === 2 && depositDetails && (
                    <Step2Instructions
                        key="step2"
                        address={depositDetails.deposit_address}
                        amount={depositDetails.amount}
                        onBack={handleBack}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};